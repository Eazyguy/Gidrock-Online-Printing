"use client";

import { handleDatabase } from "./handleDatabase";
import { useCartStore } from "@/components/CartContext";
import { setProgress } from "./types";
import {
	initializeTransaction,
	verifyTransaction,
} from "@/app/payment/actions";
import PaystackPop from "@paystack/inline-js";

export const handlePay = async (
	e: React.MouseEvent,
	hasMissingRequiredFields: boolean,
	uploadStatus: "idle" | "uploading" | "completed" | "failed",
	setUploadStatus: (
		status: "idle" | "uploading" | "completed" | "failed",
	) => void,
	form: any,
	gid: string,
	setProgress: setProgress,
) => {
	e.preventDefault();
	if (hasMissingRequiredFields) return alert(" Fill the required fields");
	if (uploadStatus === "uploading") return;

	const { total, cartItems, clearCart } = useCartStore.getState();
	setUploadStatus("uploading");
	setProgress(0);
	try {
		const orderCreated = await handleDatabase(
			form,
			gid,
			cartItems,
			total,
			setProgress,
			true,
		);
		setUploadStatus(orderCreated ? "completed" : "failed");
		if (orderCreated) {
			const setup = await initializeTransaction(form.email, total, gid);

			if ("error" in setup) {
				setUploadStatus("failed");
				alert(setup.error);
				return;
			}

			try {
				const popup = new PaystackPop();
				popup.resumeTransaction(setup.access_code, {
					onSuccess: async (transaction: { reference: string }) => {
						try {
							const verification = await verifyTransaction(
								transaction.reference,
								gid,
							);
							if ("error" in verification) {
								console.error(
									"Could not verify Paystack payment:",
									verification.error,
								);
								alert(
									"Payment was submitted, but could not be verified yet. Please do not retry the payment.",
								);
								return;
							}

							alert(`Payment successful. Reference: ${transaction.reference}`);
							clearCart();
						} catch (error) {
							console.error("Could not verify Paystack payment:", error);
							alert(
								"Payment was submitted, but could not be verified yet. Please do not retry the payment.",
							);
						}
					},
					onCancel: async () => {
						try {
							const response = await fetch("/api/orders/cancel", {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									gid,
									cancelToken: setup.cancelToken,
								}),
							});
							if (!response.ok) {
								throw new Error(
									`Cancellation update failed (${response.status}).`,
								);
							}
						} catch (error) {
							console.error("Could not mark order as cancelled:", error);
							alert(
								"Checkout was cancelled, but the order status could not be updated.",
							);
						} finally {
							window.location.assign("/");
						}
					},
					onError: (error: { message: string }) => {
						console.error("Paystack checkout error:", error.message);
						setUploadStatus("failed");
						alert("Unable to open Paystack checkout. Please try again.");
					},
				});
			} catch (err) {
				console.error("Popup invocation failed", err);
				setUploadStatus("failed");
				alert("Unable to open Paystack checkout. Please try again.");
			}
		}
	} catch (error) {
		console.error("Error processing order:", error);
		setUploadStatus("failed");
		alert("There was an error processing your order. Please try again.");
	}
};

export const handleInterstateWhatsapp = async (
	e: React.MouseEvent,
	hasMissingRequiredFields: boolean,
	uploadStatus: "idle" | "uploading" | "completed" | "failed",
	setUploadStatus: (
		status: "idle" | "uploading" | "completed" | "failed",
	) => void,
	form: any,
	gid: string,
	setProgress: setProgress,
) => {
	e.preventDefault();
	if (hasMissingRequiredFields) return alert(" Fill the required fields");
	if (uploadStatus === "uploading") return;

	const { total, cartItems, clearCart } = useCartStore.getState();

	const whatsappWindow = window.open("about:blank", "_blank");
	if (!whatsappWindow) {
		alert("Allow pop-ups to continue to WhatsApp");
		return;
	}

	setUploadStatus("uploading");
	setProgress(0);
	try {
		const orderCreated = await handleDatabase(
			form,
			gid,
			cartItems,
			total,
			setProgress,
		);
		if (!orderCreated) {
			whatsappWindow.close();
			setUploadStatus("failed");
			return;
		}

		const cartText = cartItems
			.map((i) => `${i.product} x${i.config?.qty}`)
			.join(",");
		const message = `
		Hello Gidrock! I want to Interstate Order
		ID: ${gid}
		Name: ${form.name}
		Phone: ${form.phoneNumber}
		Address: ${form.address}
		Items: ${cartText}
		subtotal: ${total}
		`;

		const whatsappUrl = `https://wa.me/${+2347017897866}?text=${encodeURIComponent(message)}`;
		whatsappWindow.location.href = whatsappUrl;
		setUploadStatus("completed");
		clearCart();
	} catch (error) {
		console.error("Error processing WhatsApp order:", error);
		whatsappWindow.close();
		setUploadStatus("failed");
		alert("There was an error processing your order. Please try again.");
	}
};
