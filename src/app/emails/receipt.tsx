import { Html, Head, Body, Container, Text } from "react-email";

const emailReceipt = (gid: string, transactionReference: string) => {
	return (
		<Html>
			<Head />
			<Body style={{ margin: 0, padding: "24px", fontFamily: "Arial, sans-serif" }}>
				<Container style={{ maxWidth: "800px", margin: "0 auto" }}>
					<Text style={{ fontSize: "16px", color: "#111827" }}>
						Thank you for your order. Your receipt is included below and attached as a PNG.
					</Text>
					<img
						src="cid:receipt-image"
						alt={`Receipt ${gid} - ${transactionReference}`}
						width="800"
						style={{ display: "block", width: "100%", maxWidth: "800px", height: "auto" }}
					/>
				</Container>
			</Body>
		</Html>
	);
};

export default emailReceipt;
