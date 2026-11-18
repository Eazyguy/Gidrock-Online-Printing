"use client";

import { useState } from "react";
import GidrockInput from "../components/GidrockInput";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/supabase-client";
import { useRouter } from "next/navigation";

const page = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		const { data: authData, error: authError } =
			await supabase.auth.signInWithPassword({
				email,
				password,
			});

		if (authError) {
			setError(authError.message);
			setLoading(false);
			return;
		}

		const userId = authData.user?.id;
		if (!userId) {
			setError("User not found.");
			setLoading(false);
			return;
		}

		const { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (profileError || !profile) {
			setError("No profile found. Contact admin.");
			setLoading(false);
			return;
		}

		if (profile.role === "admin") {
			router.push("/dashboard/admin");
		} else if (profile.role === "cashier") {
			router.push("/dashboard/cashier");
		}
	};
	return (
		<div className="flex min-h-screen items-center justify-center bg-green-50/70 p-4 ">
			<div className="card w-full max-w-md bg-green-100/50 shadow-xl">
				<h3 className="card-title text-2xl font-bold text-green-900 justify-center">
					{" "}
					Login
				</h3>
				{error && (
					<div role="alert" className="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 shrink-0 stroke-current"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Error! Task failed successfully., {error}</span>
					</div>
				)}
				<form
					className="card w-full max-w-md bg-green-100 p-6 shadow-lg shadow-green-900 md:p-10"
					onSubmit={handleLogin}
				>
					<GidrockInput
						label="Email Adrress"
						type="email"
						placeholder="gidrock@example.com"
						icon={EnvelopeIcon}
						value={email}
						onChange={setEmail}
					/>

					<GidrockInput
						label="Password"
						type="password"
						placeholder="................."
						icon={LockClosedIcon}
						value={password}
						onChange={setPassword}
					/>

					<button
						className="btn bg-green-800 text-white hover:bg-green-900 disabled:opacity-50 w-fit p-4 mx-auto"
						type="submit"
						disabled={loading}
					>
						{loading ? (
							<span className="loading loading-dots loading-lg"></span>
						) : (
							"Login"
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default page;
