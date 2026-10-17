import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/supabase-client";

export async function POST(request: Request) {
	try {
		const rawBody = await request.text();
		const payStackSignature = request.headers.get("x-paystack-signature");
		const secretKey = process.env.PAYSTACK_SECRET_KEY;

		if (!payStackSignature || !secretKey) {
			return NextResponse.json(
				{ error: "Webhook signature or secret is missing" },
				{ status: 401 },
			);
		}
		if (!/^[a-f0-9]{128}$/i.test(payStackSignature)) {
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const hash = crypto
			.createHmac("sha512", secretKey)
			.update(rawBody)
			.digest("hex");

		const expectedSignature = Buffer.from(hash, "hex");
		const receivedSignature = Buffer.from(payStackSignature, "hex");
		if (
			expectedSignature.length !== receivedSignature.length ||
			!crypto.timingSafeEqual(expectedSignature, receivedSignature)
		) {
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		const event = JSON.parse(rawBody);

		if (event.event === "charge.success" || event.event === "charge.failed") {
			const gid = event.data?.metadata?.gid;
			if (typeof gid !== "string" || !gid) {
				return NextResponse.json(
					{ error: "Transaction GID is missing" },
					{ status: 400 },
				);
			}

			console.log(`Received webhook for GID: ${gid}, Event: ${event.event}`);

			const status = event.event === "charge.success" ? "completed" : "failed";
			const updateQuery = supabase
				.from("orders")
				.update({ status })
				.eq("gid", gid);
			const { data: updatedOrder, error: updateError } =
				status === "failed"
					? await updateQuery
							.neq("status", "completed")
							.select("gid")
							.maybeSingle()
					: await updateQuery.select("gid").maybeSingle();

			if (updateError) {
				console.error(`Failed updating order status to ${status}:`, updateError);
				return NextResponse.json(
					{ error: "Could not update order status" },
					{ status: 500 },
				);
			}

			if (!updatedOrder) {
				const { data: currentOrder, error: lookupError } = await supabase
					.from("orders")
					.select("status")
					.eq("gid", gid)
					.maybeSingle();

				if (lookupError) {
					console.error(
						"Could not check order status after webhook:",
						lookupError,
					);
					return NextResponse.json(
						{ error: "Could not check order status" },
						{ status: 500 },
					);
				}

				if (status === "failed" && currentOrder?.status === "completed") {
					return NextResponse.json({ received: true });
				}

				return NextResponse.json(
					{ error: "Order was not found for this transaction" },
					{ status: 404 },
				);
			}
		}

		return NextResponse.json({ received: true });
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json(
			{ error: "Fatal handler exception" },
			{ status: 500 },
		);
	}
}
