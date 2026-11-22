"use client";

import { useState } from "react";
import GidrockInput from "../components/GidrockInput";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { supabase } from "@/supabase-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
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
				email: email.trim(),
				password,
			});

		if (authError) {
			setError("The email or password is incorrect.");
			setLoading(false);
			return;
		}

		const userEmail = authData.user?.email;
		if (!userEmail) {
			setError("User not found.");
			setLoading(false);
			return;
		}

		const { data: profile, error: profileError } = await supabase
			.from("profiles")
			.select("role")
			.eq("email", userEmail)
			.maybeSingle();

		if (profileError || !profile) {
			setError(`No profile found. Contact admin. ${profileError?.message}`);
			setLoading(false);
			return;
		}

		if (profile.role !== "admin" && profile.role !== "cashier") {
			setError("This account does not have dashboard access.");
			setLoading(false);
			return;
		}

		router.replace("/dashboard");
		router.refresh();
	};
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-green-300 p-4">
			<div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-green-100/55 shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
				<div className="relative hidden min-h-[520px] items-end p-10 md:flex">
					<Image
						src="/uu.webp"
						alt=""
						fill
						priority
						className="object-cover"
						sizes="(min-width: 768px) 360px, 0px"
					/>
					<div className="absolute inset-0 bg-green-950/60" />
					<div className="relative text-white">
						<p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-200">
							Gidrock
						</p>
						<p className="mt-3 max-w-xs text-2xl font-bold">
							Dashboard access for your printing team
						</p>
					</div>
				</div>

				<div className="flex min-h-[520px] items-center bg-green-100/50 p-6 sm:p-10 shadow-2xl shadow-green-950">
					<div className="w-full">
						<h1 className="text-3xl font-bold text-green-950">Welcome back</h1>
						<p className="mt-2 text-sm text-gray-500">Sign in to your dashboard</p>

						{error && (
							<div
								role="alert"
								className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
							>
								{error}
							</div>
						)}

						<form className="mt-7 space-y-3" onSubmit={handleLogin}>
							<GidrockInput
								label="Email address"
								type="email"
								placeholder="gidrock@example.com"
								icon={EnvelopeIcon}
								value={email}
								onChange={setEmail}
								hint="Enter a valid email address"
							/>

							<GidrockInput
								label="Password"
								type="password"
								placeholder="Enter your password"
								icon={LockClosedIcon}
								value={password}
								onChange={setPassword}
								hint="Enter your password"
							/>

							<button
								className="btn mt-3 h-12 w-full border-0 bg-green-800 text-base text-white hover:bg-green-900 disabled:opacity-60"
								type="submit"
								disabled={loading}
							>
								{loading ? (
									<span className="loading loading-dots loading-md" />
								) : (
									"Sign in"
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
