"use server";

import crypto from "crypto";
import { supabase } from "@/supabase-client";
import { createCancellationToken } from "@/lib/paystack-cancellation";

export const initializeTransaction = async (
	email: string,
	amount: number,
	gid: string,
) => {
	const secretKey = process.env.PAYSTACK_SECRET_KEY;
	if (!secretKey) {
		console.error("Paystack secret key is not configured.");
		return { error: "Payment service is not configured." };
	}
	if (
		typeof email !== "string" ||
		typeof gid !== "string" ||
		!email.trim() ||
		!Number.isFinite(amount) ||
		amount <= 0 ||
		!gid.trim()
	) {
		return { error: "Invalid payment details." };
	}
	const amountInKobo = Math.round(amount * 100);
	if (amountInKobo <= 0) return { error: "Invalid payment amount." };

	const { data: order, error: orderError } = await supabase
		.from("orders")
		.select("email, total_price, status")
		.eq("gid", gid)
		.maybeSingle();

	if (orderError) {
		console.error(
			"Could not verify order before payment initialization:",
			orderError,
		);
		return { error: "Could not verify this order. Please try again." };
	}

	if (
		!order ||
		typeof order.email !== "string" ||
		order.email.trim().toLowerCase() !== email.trim().toLowerCase() ||
		Math.round(Number(order.total_price) * 100) !== amountInKobo ||
		!["pending", "failed", "cancelled"].includes(order.status)
	) {
		return { error: "Order details could not be verified." };
	}

	const reference = `gid-trx-${crypto.randomBytes(8).toString("hex")}-${Date.now()}`;

	try {
		const response = await fetch(
			"https://api.paystack.co/transaction/initialize",
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${secretKey}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email,
					amount: amountInKobo,
					reference,
					metadata: { gid },
				}),
			},
		);

		const result = await response.json();
		if (
			!response.ok ||
			!result.status ||
			typeof result.data?.access_code !== "string" ||
			typeof result.data?.reference !== "string"
		) {
			return { error: result.message || "Initialization failed" };
		}

		return {
			access_code: result.data.access_code,
			reference: result.data.reference,
			cancelToken: createCancellationToken(gid, secretKey),
		};
	} catch (error) {
		console.error("Paystack transaction initialization failed:", error);
		return { error: "Could not start payment. Please try again." };
	}
};

export const verifyTransaction = async (reference: string, gid: string) => {
	const secretKey = process.env.PAYSTACK_SECRET_KEY;
	if (!secretKey) {
		console.error("Paystack secret key is not configured.");
		return { error: "Payment service is not configured." };
	}
	if (
		typeof reference !== "string" ||
		typeof gid !== "string" ||
		!reference.trim() ||
		!gid.trim()
	) {
		return { error: "Invalid payment details." };
	}

	let verificationStep = "requesting Paystack verification";
	try {
		const response = await fetch(
			`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
			{
				headers: { Authorization: `Bearer ${secretKey}` },
			},
		);
		verificationStep = "reading Paystack verification response";
		const responseBody = await response.text();
		let result: unknown;
		try {
			result = JSON.parse(responseBody);
		} catch {
			console.error("Paystack verification returned invalid JSON:", {
				httpStatus: response.status,
			});
			return {
				error: `Paystack returned an invalid verification response (${response.status}).`,
			};
		}

		if (typeof result !== "object" || result === null) {
			console.error("Paystack verification returned an unexpected response:", {
				httpStatus: response.status,
				responseType: result === null ? "null" : typeof result,
			});
			return { error: "Paystack returned an unexpected verification response." };
		}

		const paystackResult = result as {
			status?: unknown;
			message?: unknown;
			data?: {
				status?: unknown;
				reference?: unknown;
				metadata?: { gid?: unknown } | null;
				currency?: unknown;
				amount?: unknown;
			} | null;
		};

		if (!response.ok || !paystackResult.status) {
			console.error("Paystack verification request failed:", {
				httpStatus: response.status,
				message: paystackResult.message,
			});
			return {
				error:
					(typeof paystackResult.message === "string" && paystackResult.message) ||
					`Paystack verification request failed (${response.status}).`,
			};
		}

		if (paystackResult.data?.status !== "success") {
			console.error(
				"Paystack transaction is not successful:",
				paystackResult.data?.status,
			);
			return {
				error: `Paystack reports this transaction as ${paystackResult.data?.status || "unverified"}.`,
			};
		}

		if (paystackResult.data.reference !== reference) {
			console.error("Paystack returned a different transaction reference.");
			return { error: "Paystack returned a different transaction reference." };
		}

		if (paystackResult.data.metadata?.gid !== gid) {
			console.error("Paystack transaction metadata does not match the order.");
			return { error: "Paystack transaction does not match this order." };
		}

		if (paystackResult.data.currency !== "NGN") {
			console.error("Paystack transaction currency does not match NGN.");
			return { error: "Payment currency does not match this order." };
		}

		verificationStep = "reading the order from Supabase";
		const { data: order, error: orderError } = await supabase
			.from("orders")
			.select("total_price, status")
			.eq("gid", gid)
			.maybeSingle();

		if (orderError) {
			console.error("Could not verify the paid order:", orderError);
			return {
				error: "Payment verified, but Supabase could not read the order.",
			};
		}

		const expectedAmount = order
			? Math.round(Number(order.total_price) * 100)
			: NaN;
		if (!order || paystackResult.data.amount !== expectedAmount) {
			console.error("Paystack transaction amount does not match the order.");
			return { error: "Payment amount does not match this order." };
		}

		verificationStep = "updating the order status in Supabase";
		if (order.status === "completed") {
			return { success: true };
		}

		const { error: updateError } = await supabase
			.from("orders")
			.update({ status: "completed" })
			.eq("gid", gid);

		if (!updateError) {
			return { success: true };
		}

		console.error("Could not update the verified payment status:", updateError);
		const { data: currentOrder, error: lookupError } = await supabase
			.from("orders")
			.select("status")
			.eq("gid", gid)
			.maybeSingle();

		if (currentOrder?.status === "completed") {
			return { success: true };
		}

		if (lookupError) {
			console.error(
				"Could not confirm payment status after update failure:",
				lookupError,
			);
		}

		return {
			error:
				"Payment was verified, but Supabase could not update the order status. Do not pay again; contact support.",
		};
	} catch (error) {
		const errorDetails =
			error instanceof Error
				? { name: error.name, message: error.message }
				: { message: String(error) };
		console.error("Paystack transaction verification failed:", {
			step: verificationStep,
			...errorDetails,
		});
		return {
			error: `Payment verification failed while ${verificationStep}. Check the server logs for details.`,
		};
	}
};
