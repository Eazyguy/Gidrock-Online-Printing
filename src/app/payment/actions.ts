"use server";

import crypto from "crypto";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
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

	let supabase: ReturnType<typeof createSupabaseAdmin>;
	try {
		supabase = createSupabaseAdmin();
	} catch (error) {
		console.error(
			"Could not connect to Supabase before payment initialization:",
			error,
		);
		return { error: "Payment service is not configured." };
	}

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

	try {
		const response = await fetch(
			`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
			{
				headers: { Authorization: `Bearer ${secretKey}` },
			},
		);
		const result = await response.json();

		if (
			!response.ok ||
			!result.status ||
			result.data?.status !== "success" ||
			result.data?.reference !== reference ||
			result.data?.metadata?.gid !== gid
		) {
			return { error: "Paystack could not verify this payment." };
		}

		const supabase = createSupabaseAdmin();
		const { data: order, error: orderError } = await supabase
			.from("orders")
			.select("total_price")
			.eq("gid", gid)
			.maybeSingle();

		if (orderError) {
			console.error("Could not verify the paid order:", orderError);
			return { error: "Could not verify the paid order." };
		}

		const expectedAmount = order
			? Math.round(Number(order.total_price) * 100)
			: NaN;
		if (
			!order ||
			result.data?.currency !== "NGN" ||
			result.data?.amount !== expectedAmount
		) {
			return { error: "Payment does not match this order." };
		}

		const { data: updatedOrder, error: updateError } = await supabase
			.from("orders")
			.update({ status: "completed" })
			.eq("gid", gid)
			.select("gid")
			.maybeSingle();

		if (updateError || !updatedOrder) {
			console.error(
				"Could not update the verified payment status:",
				updateError,
			);
			return {
				error: "Payment was verified but the order status could not be updated.",
			};
		}

		return { success: true };
	} catch (error) {
		console.error("Paystack transaction verification failed:", error);
		return { error: "Could not verify payment. Please try again." };
	}
};
