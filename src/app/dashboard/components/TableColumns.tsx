import { type orders } from "../admin/types/ordersTypes";
import { formatCurrency } from "@/app/(main)/products/configuration/formatCurrency";
import { EyeIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";

export const columns = [
	{
		name: "Order ID",
		selector: (row: orders) => row.gid,
	},
	{ name: "Customer", selector: (row: orders) => row.customer_name },
	{
		name: "product",
		selector: (row: orders) => row.cart_items.map((items) => items.product),
	},
	{
		name: "Status",
		selector: (row: orders) => row.status,
		sortable: true,
		cell: (i: orders) => {
			const colors: any = {
				completed: "bg-green-500",
				pending: "bg-yellow-500",
				failed: "bg-red-500",
				cancelled: "bg-gray-500",
			};
			return (
				<span
					className={`text-sm font-medium text-black rounded-2xl p-1 ${colors[i.status]}`}
				>
					{i.status}
				</span>
			);
		},
	},
	{
		name: "Amount",
		selector: (row: orders) => formatCurrency(row.total_price),
	},
	{
		name: "Date",
		selector: (row: orders) => row.created_at,
		sortable: true,
		cell: (row: orders) => (
			<span>{dayjs(row.created_at).format("MMM D, YYYY")}</span>
		),
	},
	{
		name: "Actions",
		sortable: false,
		cell: () => (
			<button className="p-2 rounded hover:bg-gray-100">
				<EyeIcon width={20} />
			</button>
		),
	},
];
