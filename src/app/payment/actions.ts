"use server";

import crypto from "crypto";

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
	if (!email.trim() || !Number.isFinite(amount) || amount <= 0 || !gid.trim()) {
		return { error: "Invalid payment details." };
	}
	const amountInKobo = Math.round(amount * 100);
	if (amountInKobo <= 0) return { error: "Invalid payment amount." };

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
		};
	} catch (error) {
		console.error("Paystack transaction initialization failed:", error);
		return { error: "Could not start payment. Please try again." };
	}
};
