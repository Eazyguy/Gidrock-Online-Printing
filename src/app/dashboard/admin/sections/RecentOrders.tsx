import { useMemo, useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { type orders } from "../types/ordersTypes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { columns } from "../../components/TableColumns";

import { FaDownload, FaPlus } from "react-icons/fa6";
import { AiOutlineSearch, AiOutlineFilter } from "react-icons/ai";
import { CartItem } from "@/components/cartTypes";
import { formatDate } from "../../middleware/formatDate";
import { TableSkeleton } from "../../components/TableSkeleton";
import { FaFileCsv, FaFilePdf, FaFileExcel } from "react-icons/fa6";
import { handleExportCSV, handleExportXLSX } from "../../actions/handleExport";

const RecentOrders = ({ orders }: { orders: orders[] }) => {
	const [ordersData, setOrdersData] = useState<orders[]>([]);
	const [search, setSearch] = useState<string>("");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [loading, setLoading] = useState<boolean>(true);
	const [openExport, setOpenExport] = useState<boolean>(false);

	useEffect(() => {
		setLoading(true);

		const timer = setTimeout(() => {
			setOrdersData(orders as orders[]);
			setLoading(false);
		}, 800);

		return () => clearTimeout(timer);
	}, []);

	const filter = useMemo(() => {
		return orders.filter((o) => {
			const marchSearch = `${o.gid} ${o.customer_name}`
				.toLowerCase()
				.includes(search.toLowerCase());
			const marchFilter = filterStatus === "All" || o.status == filterStatus;
			return marchSearch && marchFilter;
		});
	}, [orders, search, filterStatus]);

	return (
		<div className="mt-10 space-y-2">
			<h2 className="text-2xl text-black font-bold">Recent Orders</h2>

			<div className="flex gap-2 justify-end mb-5">
				<div className="relative">
					<button
						className="border rounded-lg px-4 py-2 text-sm flex items-center gap-2 text-black hover:bg-gray-300"
						onClick={() => setOpenExport(!openExport)}
					>
						<FaDownload /> Export
					</button>
					{openExport && (
						<div className="absolute right-0 text-black bg-gray-200 border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50">
							<button
								className="w-full p-3 text-sm border border-white"
								onClick={() => handleExportCSV(filter)}
							>
								<FaFileCsv className="inline" /> as CSV
							</button>

							<button className="w-full p-3 text-sm border border-white">
								<FaFilePdf className="inline" /> as PDF
							</button>

							<button
								className="w-full p-3 text-sm border border-white"
								onClick={() => handleExportXLSX(filter)}
							>
								<FaFileExcel className="inline" /> as Excel
							</button>
						</div>
					)}
				</div>

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
			{loading ? (
				<TableSkeleton />
			) : (
				<DataTable
					columns={columns}
					data={filter}
					highlightOnHover
					resizable
					responsive
					fixedHeader
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
			)}
		</div>
	);
};

export default RecentOrders;
