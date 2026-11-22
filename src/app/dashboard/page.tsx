import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const Dashboard = async () => {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user?.email) redirect("/dashboard/login");

	const { data: profile, error } = await supabase
		.from("profiles")
		.select("role")
		.eq("email", user.email)
		.maybeSingle();

	if (error) throw error;

	if (profile?.role === "admin") redirect("/dashboard/admin");
	if (profile?.role === "cashier") redirect("/dashboard/cashier");

	redirect("/dashboard/login");
};

export default Dashboard;
