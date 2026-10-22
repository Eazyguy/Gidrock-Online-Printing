"use server";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { formatCurrency } from "@/app/products/configuration/formatCurrency";
import type { ReceiptOrder } from "@/app/receipt/[gid]/actions";

export const renderReceiptImage = async (
	order: ReceiptOrder,
	transactionReference: string,
) => {
	const logo = await readFile(join(process.cwd(), "public", "uu.png"));
	const logoDataUri = `data:image/png;base64,${logo.toString("base64")}`;
	const receiptDate = order.created_at ? new Date(order.created_at) : null;
	const isPaid = order.status === "completed";
	const imageResponse = new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				padding: 24,
				backgroundColor: "#f3f4f6",
				color: "#111827",
				fontFamily: "Arial, sans-serif",
			}}
		>
			<div
				style={{
					width: "100%",
					display: "flex",
					flexDirection: "column",
					padding: 20,
					backgroundColor: "#ffffff",
					borderRadius: 12,
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: 20,
						backgroundColor: "#166534",
						borderRadius: 12,
					}}
				>
					<img src={logoDataUri} alt="Gidrock" width={150} height={100} />
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							color: "#ffffff",
							fontWeight: 700,
						}}
					>
						<div style={{ display: "flex", fontSize: 26, fontWeight:"bold" }}>RECEIPT</div>
						{receiptDate && !Number.isNaN(receiptDate.getTime()) && (
							<div style={{ display: "flex", fontSize: 16, marginTop: 6 }}>
								{receiptDate.toLocaleDateString("en-NG", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</div>
						)}
					</div>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						padding: "24px 20px",
						fontSize: 16,
					}}
				>
					<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
						<div style={{ display: "flex", color: "#6b7280", marginBottom: 4 fontWeight:"bold"}}>
							BILL TO
						</div>
						<div
							style={{
								display: "flex",
								color: "#111827",
								fontSize: 20,
								fontWeight: 700,
							}}
						>
							{order.customer_name}
						</div>
						<div style={{ display: "flex", color: "#334155" }}>{order.phone}</div>
						<div style={{ display: "flex", color: "#334155" }}>{order.email}</div>
						<div style={{ display: "flex", color: "#334155" }}>
							{[order.address, order.localGovernment, order.state]
								.filter(Boolean)
								.join(", ")}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							gap: 6,
						}}
					>
						<div style={{ display: "flex", color: "#6b7280" }}>RECEIPT NO.</div>
						<div style={{ display: "flex", color: "#111827", fontWeight: 700 }}>
							{order.gid}
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						flexDirection: "column",
						margin: "0 20px",
						padding: 18,
						border: `1px solid ${isPaid ? "#16a34a" : "#f59e0b"}`,
						borderRadius: 10,
						backgroundColor: isPaid ? "#dcfce7" : "#fef3c7",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							color: isPaid ? "#16a34a" : "#b45309",
							fontSize: 19,
							fontWeight: 700,
						}}
					>
						{isPaid && (
						<div style={{ display: "flex", width: 22, height: 22, marginRight: 8, backgroundColor: "#16a34a", borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.312 5.312 8.47-12.7a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
</div>


						)}
						Payment {isPaid ? "Confirmed" : order.status}
					</div>
					<div
						style={{ display: "flex", marginTop: 8, color: "#374151", fontSize: 14 }}
					>
						Paystack reference: {transactionReference}
					</div>
				</div>

				<div
					style={{
						display: "flex",
						padding: "20px 20px 12px",
						color: "#111827",
						fontSize: 17,
						fontWeight: 700,
					}}
				>
					ITEM DETAILS
				</div>
				<div style={{ display: "flex", flexDirection: "column", margin: "0 20px" }}>
					<div
						style={{
							display: "flex",
							padding: "12px",
							backgroundColor: "#d1d5db",
							color: "#374151",
							fontSize: 15,
							fontWeight: 700,
						}}
					>
						<div style={{ display: "flex", width: "64%" }}>Item</div>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
								width: "12%",
							}}
						>
							Qty
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "flex-end",
								width: "24%",
							}}
						>
							Price
						</div>
					</div>
					{order.cart_items.map((item) => (
						<div
							key={item.id}
							style={{
								display: "flex",
								alignItems: "center",
								padding: "14px 12px",
								borderBottom: "1px solid #e5e7eb",
								color: "#111827",
								fontSize: 15,
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									width: "64%",
									gap: 4,
								}}
							>
								<div style={{ display: "flex", fontWeight: 700 }}>
									{item.product || "Product"}
								</div>
								<div style={{ display: "flex", color: "#4b5563", fontSize: 13 }}>
									{[
										item.config?.size,
										item.config?.thickness,
										item.config?.lamination,
										item.config?.widthFt && item.config?.heightFt
											? `${item.config.widthFt} × ${item.config.heightFt} ft`
											: null,
									]
										.filter(Boolean)
										.join(" · ")}
								</div>
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									width: "12%",
								}}
							>
								{item.config?.qty ?? "—"}
							</div>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									width: "24%",
								}}
							>
								{formatCurrency(item.price)}
							</div>
						</div>
					))}
				</div>

				<div
					style={{
						display: "flex",
						margin: "16px 20px",
						borderTop: "1px solid #9ca3af",
					}}
				/>
				<div
					style={{ display: "flex", justifyContent: "flex-end", margin: "0 20px" }}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							padding: "14px 18px",
							border: "1px solid #16a34a",
							borderRadius: 8,
							backgroundColor: "#dcfce7",
						}}
					>
						<div
							style={{
								display: "flex",
								color: "#15803d",
								fontSize: 14,
								fontWeight: 700,
							}}
						>
							Order Total
						</div>
						<div
							style={{
								display: "flex",
								marginTop: 4,
								color: "#166534",
								fontSize: 28,
								fontWeight: 700,
							}}
						>
							{formatCurrency(order.total_price)}
						</div>
						<div
							style={{
								display: "flex",
								marginTop: 4,
								color: "#111827",
								fontSize: 12,
								fontWeight: 700,
							}}
						>
							{order.delivery}
						</div>
					</div>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						gap: 20,
						marginTop: 20,
						padding: 18,
						borderRadius: 10,
						backgroundColor: "#9ca3af",
						color: "#111827",
						fontSize: 13,
					}}
				>
					<div
						style={{ display: "flex", flexDirection: "column", gap: 6, width: "58%" }}
					>
						<div style={{ display: "flex" }}>
							Order status:{" "}
							<span style={{ color: "#166534", fontWeight: 700 }}>
								{order.status.toUpperCase()}
							</span>
						</div>
						<div style={{ display: "flex" }}>
							Your order is being processed and will be delivered within 48 hours.
						</div>
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-end",
							gap: 4,
						}}
					>
						<div style={{ display: "flex", fontWeight: 700 }}>
							Gidrock online print
						</div>
						<div style={{ display: "flex" }}>
							07017897866, 09133532790, 07070647836
						</div>
						<div style={{ display: "flex" }}>hello@gidrockprint.ng</div>
					</div>
				</div>
			</div>
		</div>,
		{
			width: 800,
			height: 900 + order.cart_items.length * 70,
		},
	);

	return Buffer.from(await imageResponse.arrayBuffer());
};
