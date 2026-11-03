import { XCircleIcon } from "@heroicons/react/24/outline";
import {
	AiOutlineClockCircle,
	AiOutlineCheckCircle,
	AiOutlineCloseCircle,
} from "react-icons/ai";
import { formatDate } from "../../middleware/formatDate";
import { filterOrdersByStatus } from "../../middleware/filterOrdersByStatus";
import { orders } from "../types/ordersTypes";

const overviewCards = ({ orders }: { orders: orders[] }) => {
	return (
		<>
			<h2 className="text-black text-2xl font-bold">Dashboard</h2>
			<p className="text-gray-800">
				Overview of orders and recent activity Today {formatDate()}
			</p>
			<div className="flex flex-col md:flex-row mt-5 gap-5 md:gap-3">
				<div className="border-green-900 border-2 rounded py-3 shadow-gray-800 shadow-xl mx-auto bg-linear-60 from-red-200 to-red-400 via-red-300 w-65 md:w-60 md:max-w-65">
					<p className="text-red-950 text-center font-bold text-lg">Failed Orders</p>
					<XCircleIcon
						className="rounded-full text-red-700 mx-auto hover:animate-pulse"
						width={200}
					/>
					<p className="text-black text-center">
						<span className="text-lg font-bold">
							{filterOrdersByStatus("failed", orders).length}
						</span>{" "}
						failed Orders
					</p>
				</div>

				<div className="border-green-900 border-2 rounded py-3 shadow-gray-800 shadow-xl mx-auto bg-linear-60 from-yellow-200 to-yellow-400 via-yellow-300 w-65 md:md:w-60 md:max-w-65">
					<p className="text-yellow-950 text-center font-bold text-lg">
						Pending Orders
					</p>
					<AiOutlineClockCircle
						className="rounded-full text-yellow-700 mx-auto hover:animate-spin"
						size={180}
					/>
					<p className="text-black text-center">
						<span className="text-lg font-bold">
							{filterOrdersByStatus("pending", orders).length}
						</span>{" "}
						pending Orders
					</p>
				</div>

				<div className="border-green-900 border-2 rounded py-3 shadow-gray-800 shadow-xl mx-auto bg-linear-60 from-green-200 to-green-400 via-green-300 md:md:w-60 w-65">
					<p className="text-green-950 text-center font-bold text-lg">
						Completed Orders
					</p>
					<AiOutlineCheckCircle
						className="rounded-full text-green-700 mx-auto hover:animate-bounce"
						size={180}
					/>
					<p className="text-black text-center">
						<span className="text-lg font-bold">
							{filterOrdersByStatus("completed", orders).length}
						</span>{" "}
						completed Orders
					</p>
				</div>
				<div className="border-green-900 border-2 rounded py-3 shadow-gray-800 shadow-xl mx-auto bg-linear-60 from-gray-200 to-gray-400 via-gray-300 md:md:w-60 w-65 md:max-w-65">
					<p className="text-gray-950 text-center font-bold text-lg">
						Cancelled Orders
					</p>
					<AiOutlineCloseCircle
						className="rounded-full text-gray-700 mx-auto hover:animate-ping"
						size={180}
					/>
					<p className="text-black text-center">
						<span className="text-lg font-bold">
							{filterOrdersByStatus("cancelled", orders).length}
						</span>{" "}
						cancelled Orders
					</p>
				</div>
			</div>
		</>
	);
};

export default overviewCards;
