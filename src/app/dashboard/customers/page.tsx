"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import { supabase } from "@/supabase-client";
import type { orders } from "../admin/types/ordersTypes";
import { formatCurrency } from "@/app/(main)/products/configuration/formatCurrency";

type Customer = {
	name: string;
	email: string;
	phone: string;
	address: string;
	orders: number;
	spent: number;
	lastOrder: string;
};

export default function CustomersPage() {
	const [orders, setOrders] = useState<orders[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

	useEffect(() => {
		let active = true;
		void supabase
			.from("orders")
			.select("*")
			.order("created_at", { ascending: false })
			.then(({ data, error }) => {
				if (!active) return;
				if (error) console.error("Could not load customers:", error);
				setOrders((data as orders[]) ?? []);
				setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const customers = useMemo(() => {
		const map = new Map<string, Customer>();
		orders.forEach((order) => {
			const key = order.email || order.phone || order.customer_name;
			const current = map.get(key);
			const completed = order.status === "completed" ? Number(order.total_price || 0) : 0;
			map.set(key, {
				name: order.customer_name,
				email: order.email ?? "",
				phone: order.phone,
				address: [order.address, order.localGovernment, order.state].filter(Boolean).join(", "),
				orders: (current?.orders ?? 0) + 1,
				spent: (current?.spent ?? 0) + completed,
				lastOrder: !current?.lastOrder || dayjs(order.created_at).isAfter(dayjs(current.lastOrder))
					? order.created_at
					: current.lastOrder,
			});
		});
		return Array.from(map.values());
	}, [orders]);

	const filtered = customers.filter((customer) =>
		`${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(search.toLowerCase()),
	);

	const columns = [
		{ name: "Customer", selector: (row: Customer) => row.name, sortable: true },
		{ name: "Email", selector: (row: Customer) => row.email || "—" },
		{ name: "Phone", selector: (row: Customer) => row.phone || "—" },
		{ name: "Address", selector: (row: Customer) => row.address || "—", grow: 2 },
		{ name: "Orders", selector: (row: Customer) => row.orders, sortable: true, width: "90px" },
		{ name: "Completed spend", selector: (row: Customer) => formatCurrency(row.spent), sortable: true },
		{ name: "Last order", selector: (row: Customer) => dayjs(row.lastOrder).format("MMM D, YYYY"), sortable: true },
	];

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900">Customers</h1>
			<p className="mt-1 text-sm text-gray-600">Customer details and order history</p>
			<div className="mt-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
				<input
					type="search"
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					placeholder="Search customers"
					className="mb-4 w-full max-w-sm rounded-lg border border-green-200 px-4 py-2 text-sm text-gray-900 outline-none focus:border-green-700"
				/>
				<DataTable
					columns={columns}
					data={filtered}
					progressPending={loading}
					pagination
					paginationPerPage={10}
					highlightOnHover
					pointerOnHover
					responsive
					noDataComponent="No customers found."
				/>
			</div>
		</div>
	);
}
