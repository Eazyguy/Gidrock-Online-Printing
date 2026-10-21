"use server";

import { Resend } from "resend";
import emailReceipt from "@/app/emails/receipt";
import { getDatabaseData } from "@/app/receipt/[gid]/actions";
import { renderReceiptImage } from "./renderReceiptImage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const sendEmail = async (
	userEmail: string,
	gid: string,
	transactionReference: string,
) => {
	try {
		const order = await getDatabaseData(gid);
		if (!order) {
			throw new Error(`Order ${gid} not found for receipt email.`);
		}

		const image = await renderReceiptImage(order, transactionReference);
		console.log("Image Rendered size:", image.length);

		const resend = new Resend(process.env.RESEND_API_KEY);

		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: [userEmail],
			subject: "Gidrock Online Print Receipt",
			react: emailReceipt(gid, transactionReference),
			attachments: [
				{
					filename: `receipt-${gid}.png`,
					content: image,
					contentType: "image/png",
					contentId: "receipt-image",
				},
			],
		});
	} catch (error) {
		console.error(error);
	}
};
