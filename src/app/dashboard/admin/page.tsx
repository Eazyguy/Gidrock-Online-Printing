import AdminDashboard from "./sections/AdminDashboard";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const Admin = async () => {
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

	if (profileError) {
		throw profileError;
	}

	if (!profile || profile.role !== "admin") {
		redirect("/dashboard/cashier");
	}

	const { data: orders, error: ordersError } = await supabase
		.from("orders")
		.select("*")
		.order("created_at", { ascending: false });

	if (ordersError) throw ordersError;

	return (
		<div>
			<AdminDashboard orders={orders ?? []} />
		</div>
	);
};

export default Admin;
