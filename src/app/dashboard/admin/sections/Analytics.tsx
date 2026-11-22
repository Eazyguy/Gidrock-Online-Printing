"use client";

import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import dayjs from "dayjs";
import type { orders } from "../types/ordersTypes";
import { formatCurrency } from "@/app/(main)/products/configuration/formatCurrency";

const COLORS = ["#16a34a", "#eab308", "#ef4444", "#6b7280"];

export default function Analytics({ orders }: { orders: orders[] }) {
	const statusCounts = ["completed", "pending", "failed", "cancelled", "delivered"].map((status) => ({
		name: status[0].toUpperCase() + status.slice(1),
		value: orders.filter((order) => order.status === status).length,
	}));

	const revenue = orders
		.filter((order) => order.status === "completed")
		.reduce((total, order) => total + Number(order.total_price || 0), 0);

	const dailyRevenue = new Map<string, number>();
	orders
		.filter((order) => order.status === "completed")
		.forEach((order) => {
			const day = dayjs(order.created_at).format("MMM D");
			dailyRevenue.set(day, (dailyRevenue.get(day) ?? 0) + Number(order.total_price || 0));
		});
	const revenueData = Array.from(dailyRevenue.entries())
		.sort((a, b) => dayjs(a[0], "MMM D").valueOf() - dayjs(b[0], "MMM D").valueOf())
		.slice(-14)
		.map(([day, amount]) => ({ day, amount }));

	const cards = [
		{ label: "Total orders", value: orders.length, color: "border-green-700 bg-green-50" },
		{ label: "Revenue", value: formatCurrency(revenue), color: "border-emerald-700 bg-emerald-50" },
		{ label: "Pending", value: statusCounts[1].value, color: "border-yellow-600 bg-yellow-50" },
		{ label: "Customers", value: new Set(orders.map((order) => order.email || order.phone)).size, color: "border-blue-700 bg-blue-50" },
	];

	return (
		<>
			<div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				{cards.map((card) => (
					<div key={card.label} className={`rounded-xl border-l-4 p-4 shadow-sm ${card.color}`}>
						<p className="text-sm font-medium text-gray-600">{card.label}</p>
						<p className="mt-1 text-2xl font-bold text-gray-900">{card.value}</p>
					</div>
				))}
			</div>

			<div className="mt-5 grid gap-5 lg:grid-cols-5">
				<div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-3">
					<h2 className="font-bold text-gray-900">Completed revenue</h2>
					<div className="mt-3 h-72">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={revenueData}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="day" tick={{ fontSize: 12 }} />
								<YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₦${Number(value) / 1000}k`} />
								<Tooltip formatter={(value) => formatCurrency(Number(value))} />
								<Area type="monotone" dataKey="amount" stroke="#166534" fill="#bbf7d0" />
							</AreaChart>
						</ResponsiveContainer>
					</div>
				</div>
				<div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2">
					<h2 className="font-bold text-gray-900">Orders by status</h2>
					<div className="mt-3 h-72">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
									{statusCounts.map((entry, index) => (
										<Cell key={entry.name} fill={COLORS[index]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</>
	);
}
