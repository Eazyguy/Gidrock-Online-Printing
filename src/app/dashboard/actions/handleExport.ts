import { formatDate } from "../middleware/formatDate";
import { type CartItem } from "@/components/cartTypes";
import dayjs from "dayjs";
import { type orders } from "../admin/types/ordersTypes";
import { jsPDF } from "jspdf";
import writeXlsxFile from "write-excel-file/browser";
import { formatCurrency } from "@/app/(main)/products/configuration/formatCurrency";
import { columns } from "../components/TableColumns";

export const handleExportCSV = (filter: orders[]) => {
	if (filter.length == 0) return;
	const headers = ["Order ID, Customer, Product, Status, Total, Date"];

	const escapeCSV = (value: string) => {
		const str = String(value ?? "");
		if (str.includes(",") || str.includes('"') || str.includes("\n")) {
			return `"${str.replace(/"/g, '""')}"`;
		}
		return str;
	};

	const rows = filter.map((o) => [
		escapeCSV(o.gid),
		escapeCSV(o.customer_name),
		escapeCSV(o.cart_items.map((p: CartItem) => p.product) as any),
		escapeCSV(o.status),
		escapeCSV(String(o.total_price)),
		escapeCSV(dayjs(o.created_at).format("MMM DD YYYY")),
	]);

	const csvContent = [headers.join(","), ...rows].join("\r\n");

	const blob = new Blob(["\uFEFF" + csvContent], {
		type: "text/csv; charset=utf-8;",
	});
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.setAttribute("download", `orders as of ${formatDate()}`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export const handleExportXLSX = async (filter: orders[]) => {
	if (filter.length === 0) return;
	const data: any[][] = [
		// Header rows
		[
			{
				value: "Order ID",
				fontWeight: "bold",
				backgroundColor: "#166534",
				textColor: "#FFFFFF",
			},
			{
				value: "Customer",
				fontWeight: "bold",
				backgroundColor: "#166534",
				textColor: "#FFFFFF",
			},
			{
				value: "Product",
				fontWeight: "bold",
				backgroundColor: "#166534",
				textColor: "#FFFFFF",
			},
			{
				value: "Status",
				fontWeight: "bold",
				backgroundColor: "#166534",
				textColor: "#FFFFFF",
			},
			{
				value: "Amount",
				fontWeight: "bold",
				backgroundColor: "#166534",
				textColor: "#FFFFFF",
			},
			{
				value: "Date",
				fontWeight: "bold",
				backgroundColor: "#166534",
				textColor: "#FFFFFF",
			},
		],
		...filter.map((o) => [
			{ value: o.gid, type: String },
			{ value: o.customer_name, type: String },
			{ value: o.cart_items.map((p) => p.product).join(","), type: String },
			{ value: o.status, type: String },
			{ value: formatCurrency(o.total_price), type: String },
			{ value: dayjs(o.created_at).format("MMM DD YYYY"), type: String },
		]),
	];

	const file = writeXlsxFile(data, {
		columns: [
			{ width: 15 },
			{ width: 25 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
			{ width: 15 },
		],
		sheet: "Orders",
	}).toFile(`orders as of ${formatDate()}`);
};
