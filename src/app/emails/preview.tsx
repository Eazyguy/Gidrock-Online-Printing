import { getDatabaseData } from "@/app/receipt/[gid]/actions";
import { renderReceiptImage } from "@/app/api/send-email/renderReceiptImage";

const preview = async () => {
	const transactionReference = "gid-trx-aafa7494506b2a31-1792537752113";
	const gid = "GID-DNC5V82366";
	const order = await getDatabaseData(gid);
	if (!order) {
		throw new Error(`Order ${gid} not found for receipt email preview.`);
	}

	const image = await renderReceiptImage(order, transactionReference);
	const imageDataUri = `data:image/png;base64,${image.toString("base64")}`;

	return (
		<main
			style={{
				minHeight: "100vh",
				padding: 24,
				backgroundColor: "#e5e7eb",
			}}
		>
			<img
				src={imageDataUri}
				alt={`Receipt ${order.gid}`}
				style={{
					display: "block",
					width: "100%",
					maxWidth: 800,
					height: "auto",
					margin: "0 auto",
				}}
			/>
		</main>
	);
};

export default preview;
