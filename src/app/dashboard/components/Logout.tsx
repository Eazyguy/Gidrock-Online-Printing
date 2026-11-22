import { useAuthenticatedUser } from "../actions/auth";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase-client";

const Logout = () => {
	const { user } = useAuthenticatedUser();

	const name = user?.user_metadata?.full_name || user?.email || "User";

	function greeting() {
		const currentHour = new Date().getHours();
		if (currentHour < 12) {
			return "Good morning";
		} else if (currentHour < 18) {
			return "Good afternoon";
		} else {
			return "Good evening";
		}
	}

	const router = useRouter();

	async function handleLogout() {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("Error logging out:", error.message);
			return;
		}

		router.push("/dashboard/login");
		router.refresh();
	}

	return (
		<div className="absolute top-5 right-5 w-20 md:w-40 flex-col flex justify-center items-center gap-2 shadow-gray-900 p-1 text-center">
			<p className="text-green-900 md:text-lg leading-5 animate-bounce">
				{greeting()}, <span className="font-bold">{name}</span>!
			</p>
			<p
				className="underline cursor-pointer text-green-800 hover:text-green-950 hover:scale-105 transition-all duration-200 font-bold text-sm md:text-lg "
				onClick={handleLogout}
			>
				Logout
			</p>
		</div>
	);
};

export default Logout;
