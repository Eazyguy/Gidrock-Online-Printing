import { handleDatabase } from "./handleDatabase";
import { useCartStore } from "@/components/CartContext";

const { total, cartItems } = useCartStore.getState();

export const handlePay = async (
	e: React.MouseEvent,
	hasMissingRequiredFields: boolean,
	uploadStatus: "idle" | "uploading" | "completed" | "failed",
	setUploadStatus: (
		status: "idle" | "uploading" | "completed" | "failed",
	) => void,
	form: any,
	gid: string,
) => {
	e.preventDefault();
	if (hasMissingRequiredFields) return alert(" Fill the required fields");
	if (uploadStatus === "uploading") return;

	setUploadStatus("uploading");
	try {
		const orderCreated = await handleDatabase(form, gid, cartItems, total);
		setUploadStatus(orderCreated ? "completed" : "failed");
		if (orderCreated) {
			alert("Order saved as pending. Paystack payment will be available soon.");
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
) => {
	e.preventDefault();
	if (hasMissingRequiredFields) return alert(" Fill the required fields");
	if (uploadStatus === "uploading") return;

	const { total, cartItems } = useCartStore.getState();

	const whatsappWindow = window.open("about:blank", "_blank");
	if (!whatsappWindow) {
		alert("Allow pop-ups to continue to WhatsApp");
		return;
	}

	setUploadStatus("uploading");
	try {
		const orderCreated = await handleDatabase(form, gid, cartItems, total);
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
	} catch (error) {
		console.error("Error processing WhatsApp order:", error);
		whatsappWindow.close();
		setUploadStatus("failed");
		alert("There was an error processing your order. Please try again.");
	}
};
