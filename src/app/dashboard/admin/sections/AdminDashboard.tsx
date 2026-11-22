"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import type { orders } from "../types/ordersTypes";
import Analytics from "./Analytics";
import RecentOrders from "./RecentOrders";

type DatePreset = "all" | "today" | "7days" | "30days" | "custom";

export default function AdminDashboard({ orders }: { orders: orders[] }) {
	const [preset, setPreset] = useState<DatePreset>("all");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");

	const filteredOrders = useMemo(() => {
		let start: dayjs.Dayjs | null = null;
		let end: dayjs.Dayjs | null = null;

		if (preset === "today") {
			start = dayjs().startOf("day");
			end = dayjs().endOf("day");
		} else if (preset === "7days") {
			start = dayjs().subtract(6, "day").startOf("day");
			end = dayjs().endOf("day");
		} else if (preset === "30days") {
			start = dayjs().subtract(29, "day").startOf("day");
			end = dayjs().endOf("day");
		} else if (preset === "custom" && fromDate) {
			start = dayjs(fromDate).startOf("day");
			end = toDate ? dayjs(toDate).endOf("day") : dayjs(fromDate).endOf("day");
		}

		if (!start || !end) return orders;

		return orders.filter((order) => {
			const createdAt = dayjs(order.created_at);
			return createdAt.isValid() &&
				(createdAt.isAfter(start) || createdAt.isSame(start)) &&
				(createdAt.isBefore(end) || createdAt.isSame(end));
		});
	}, [orders, preset, fromDate, toDate]);

	return (
		<div>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
					<p className="mt-1 text-sm text-gray-600">
						Showing {filteredOrders.length} of {orders.length} orders
					</p>
				</div>

				<div className="flex flex-wrap items-end gap-2 rounded-xl border border-green-100 bg-white p-3 shadow-sm">
					<label className="text-xs font-bold text-gray-700">
						Date range
						<select
							value={preset}
							onChange={(event) => setPreset(event.target.value as DatePreset)}
							className="mt-1 block rounded-lg border border-green-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-700"
						>
							<option value="all">All time</option>
							<option value="today">Today</option>
							<option value="7days">Last 7 days</option>
							<option value="30days">Last 30 days</option>
							<option value="custom">Custom range</option>
						</select>
					</label>

					{preset === "custom" && (
						<>
							<label className="text-xs font-bold text-gray-700">
								From
								<input
									type="date"
									value={fromDate}
									onChange={(event) => setFromDate(event.target.value)}
									className="mt-1 block rounded-lg border border-green-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-700"
								/>
							</label>
							<label className="text-xs font-bold text-gray-700">
								To
								<input
									type="date"
									value={toDate}
									min={fromDate}
									onChange={(event) => setToDate(event.target.value)}
									className="mt-1 block rounded-lg border border-green-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-700"
								/>
							</label>
						</>
					)}
				</div>
			</div>

			<Analytics orders={filteredOrders} />
			<RecentOrders orders={filteredOrders} />
		</div>
	);
}
