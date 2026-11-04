import { useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { type orders } from "../types/ordersTypes";
import { formatCurrency } from "@/app/(main)/products/configuration/formatCurrency";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { EyeIcon } from "@heroicons/react/24/solid";
import { FaDownload, FaPlus } from "react-icons/fa6";
import { AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";

const RecentOrders = ({ orders }: { orders: orders[] }) => {
	const [search, setSearch] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("All");

	const filter = useMemo(() => {
		return orders.filter((o) => {
			const marchSearch = `${o.gid} ${o.customer_name}`
				.toLowerCase()
				.includes(search.toLowerCase());
			const marchFilter = filterStatus === "All" || o.status == filterStatus;
			return marchSearch && marchFilter;
		});
	}, [orders, search, filterStatus]);

	const columns = [
		{ name: "Order ID", selector: (row: orders) => row.gid },
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
	return (
		<div className="mt-10 space-y-2">
			<h2 className="text-2xl text-black font-bold">Recent Orders</h2>

			<div className="flex gap-2 justify-end mb-5">
				<button className="border rounded-lg px-4 py-2 text-sm flex items-center gap-2 text-black hover:bg-gray-300">
					<FaDownload /> Export
				</button>
				<button className="bg-green-800 text-white rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 hover:text-black">
					<FaPlus /> New Order
				</button>
			</div>

			<div className="flex gap-2">
				<div className="relative flex text-green-900 items-center rounded-lg border-green-900 border-2 p-1 min-w-16">
					<AiOutlineSearch />{" "}
					<input
						type="search"
						value={search}
						placeholder="search orders here"
						className="focus:border-0 focus:outline-0 min-w-15"
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="text-black rounded-lg border-2 flex items-center">
					<AiOutlineFilter className="text-xl w-auto shrink" />
					<select
						value={filterStatus}
						className=" text-sm text-black text-center border-green-900 focus:border-0 focus:outline-0"
						aria-placeholder="filter by"
						onChange={(e) => setFilterStatus(e.target.value)}
					>
						<option value={"All"}>All</option>
						<option value={"pending"}>Pending</option>
						<option value={"completed"}>Completed</option>
						<option value={"failed"}>Failed</option>
						<option value={"cancelled"}>Cancelled</option>
					</select>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={filter}
				highlightOnHover
				resizable
				customStyles={{
					headCells: {
						style: {
							fontWeight: "600",
							fontSize: "14px",
							background: "#fafafb",
						},
					},
				}}
			/>
		</div>
	);
};

export default RecentOrders;
