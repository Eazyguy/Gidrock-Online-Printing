import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RecentOrders from "../admin/sections/RecentOrders";

export default async function CashierPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user?.email) redirect("/dashboard/login");

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("role")
		.eq("email", user.email)
		.maybeSingle();

	if (profileError) throw profileError;
	if (!profile || profile.role !== "cashier") redirect("/dashboard/admin");

	const { data: orders, error: ordersError } = await supabase
		.from("orders")
		.select("*")
		.order("created_at", { ascending: false });

	if (ordersError) throw ordersError;

	const liveOrders = orders ?? [];
	const pending = liveOrders.filter((order) => order.status === "pending").length;
	const completed = liveOrders.filter((order) => order.status === "completed").length;

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-900">Cashier dashboard</h1>
			<p className="mt-1 text-sm text-gray-600">Manage and review customer orders</p>
			<div className="mt-5 grid gap-3 sm:grid-cols-3">
				<div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-4">
					<p className="text-sm text-gray-600">Pending orders</p>
					<p className="text-2xl font-bold">{pending}</p>
				</div>
				<div className="rounded-xl border-l-4 border-green-600 bg-green-50 p-4">
					<p className="text-sm text-gray-600">Completed orders</p>
					<p className="text-2xl font-bold">{completed}</p>
				</div>
				<div className="rounded-xl border-l-4 border-blue-600 bg-blue-50 p-4">
					<p className="text-sm text-gray-600">Total orders</p>
					<p className="text-2xl font-bold">{liveOrders.length}</p>
				</div>
			</div>
			<RecentOrders orders={liveOrders} />
		</div>
	);
}
