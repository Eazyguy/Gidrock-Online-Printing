import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { isValidCancellationToken } from "@/lib/paystack-cancellation";

export async function POST(request: Request) {
	const secretKey = process.env.PAYSTACK_SECRET_KEY;
	if (!secretKey) {
		console.error("Paystack secret key is not configured.");
		return NextResponse.json(
			{ error: "Payment service is not configured" },
			{ status: 500 },
		);
	}

	let payload: unknown;
	try {
		payload = await request.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	if (
		typeof payload !== "object" ||
		payload === null ||
		!("gid" in payload) ||
		typeof payload.gid !== "string" ||
		!("cancelToken" in payload) ||
		typeof payload.cancelToken !== "string"
	) {
		return NextResponse.json(
			{ error: "Invalid cancellation request" },
			{ status: 400 },
		);
	}

	const { gid, cancelToken } = payload;
	if (!isValidCancellationToken(gid, cancelToken, secretKey)) {
		return NextResponse.json(
			{ error: "Invalid cancellation token" },
			{ status: 401 },
		);
	}

	try {
		const supabase = createSupabaseAdmin();
		const { data: updatedOrder, error: updateError } = await supabase
			.from("orders")
			.update({ status: "cancelled" })
			.eq("gid", gid)
			.in("status", ["pending", "failed", "cancelled"])
			.select("gid")
			.maybeSingle();

		if (updateError) {
			console.error("Could not update cancelled order status:", updateError);
			return NextResponse.json(
				{ error: "Could not update order status" },
				{ status: 500 },
			);
		}

		if (updatedOrder) {
			return NextResponse.json({ status: "cancelled" });
		}

		const { data: currentOrder, error: lookupError } = await supabase
			.from("orders")
			.select("status")
			.eq("gid", gid)
			.maybeSingle();

		if (lookupError) {
			console.error("Could not check cancelled order status:", lookupError);
			return NextResponse.json(
				{ error: "Could not check order status" },
				{ status: 500 },
			);
		}

		if (!currentOrder) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		if (currentOrder.status === "completed") {
			return NextResponse.json({ status: "completed" });
		}

		return NextResponse.json(
			{ error: "Order cannot be cancelled in its current status" },
			{ status: 409 },
		);
	} catch (error) {
		console.error("Cancellation handler error:", error);
		return NextResponse.json(
			{ error: "Could not update order status" },
			{ status: 500 },
		);
	}
}
