import { ImageResponse } from "next/og";
import { formatCurrency } from "@/app/products/configuration/formatCurrency";
import type { ReceiptOrder } from "@/app/receipt/[gid]/actions";

export const renderReceiptImage = async (
	order: ReceiptOrder,
	transactionReference: string,
) => {
	const imageResponse = new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				padding: 48,
				backgroundColor: "#f8fafc",
				color: "#111827",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 28,
					backgroundColor: "#166534",
					color: "white",
					borderRadius: 16,
				}}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div style={{ fontSize: 34, fontWeight: 700 }}>GIDROCK</div>
					<div style={{ fontSize: 18 }}>ONLINE PRINT</div>
				</div>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
					<div style={{ fontSize: 34, fontWeight: 700 }}>RECEIPT</div>
					<div style={{ fontSize: 18 }}>
						{order.created_at
							? new Date(order.created_at).toLocaleDateString("en-NG", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})
							: ""}
					</div>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					padding: "30px 8px",
					fontSize: 20,
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
					<div style={{ color: "#64748b", fontSize: 16, fontWeight: 700 }}>BILL TO</div>
					<div style={{ fontSize: 24, fontWeight: 700 }}>{order.customer_name}</div>
					<div>{order.phone}</div>
					<div>{order.email}</div>
					<div>{[order.address, order.localGovernment, order.state].filter(Boolean).join(", ")}</div>
				</div>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
					<div style={{ color: "#64748b", fontSize: 16 }}>RECEIPT NO.</div>
					<div style={{ fontWeight: 700 }}>{order.gid}</div>
					<div style={{ color: "#166534", fontWeight: 700 }}>
						PAYMENT {order.status.toUpperCase()}
					</div>
					<div style={{ fontSize: 16 }}>Reference: {transactionReference}</div>
				</div>
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					padding: "14px 18px",
					backgroundColor: "#e2e8f0",
					fontWeight: 700,
					fontSize: 18,
				}}
			>
				<div style={{ width: "65%" }}>ITEM</div>
				<div style={{ width: "12%", textAlign: "center" }}>QTY</div>
				<div style={{ width: "23%", textAlign: "right" }}>PRICE</div>
			</div>
			<div style={{ display: "flex", flexDirection: "column" }}>
				{order.cart_items.map((item) => (
					<div
						key={item.id}
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "18px",
							borderBottom: "1px solid #cbd5e1",
							fontSize: 18,
						}}
					>
						<div style={{ width: "65%", display: "flex", flexDirection: "column", gap: 6 }}>
							<div style={{ fontWeight: 700 }}>{item.product || "Product"}</div>
							<div style={{ color: "#475569", fontSize: 15 }}>
								{[
									item.config?.size,
									item.config?.thickness,
									item.config?.lamination,
									item.config?.widthFt && item.config?.heightFt
										? `${item.config.widthFt} x ${item.config.heightFt} ft`
										: null,
								]
									.filter(Boolean)
									.join(" | ")}
							</div>
						</div>
						<div style={{ width: "12%", textAlign: "center" }}>
							{item.config?.qty ?? "-"}
						</div>
						<div style={{ width: "23%", textAlign: "right" }}>
							{formatCurrency(item.price)}
						</div>
					</div>
				))}
			</div>
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginTop: 24,
					padding: 20,
					backgroundColor: "#dcfce7",
					border: "1px solid #16a34a",
					borderRadius: 12,
					fontSize: 26,
					fontWeight: 700,
				}}
			>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
					<div style={{ color: "#166534", fontSize: 16 }}>ORDER TOTAL</div>
					<div>{formatCurrency(order.total_price)}</div>
					<div style={{ color: "#475569", fontSize: 16, fontWeight: 400 }}>{order.delivery}</div>
				</div>
			</div>
			<div style={{ marginTop: "auto", paddingTop: 24, color: "#475569", fontSize: 16 }}>
				Gidrock Online Print | 07017897866, 09133532790, 07070647836 | hello@gidrockprint.ng
			</div>
		</div>,
		{
			width: 1000,
			height: 650 + order.cart_items.length * 88,
		},
	);

	return Buffer.from(await imageResponse.arrayBuffer());
};
