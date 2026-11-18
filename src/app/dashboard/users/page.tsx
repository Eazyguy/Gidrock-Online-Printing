"use client";

import { useState } from "react";
import GidrockSwitch from "../components/GidrockSwitch";
import GidrockInput from "../components/GidrockInput";
import {
	UserIcon,
	PhoneIcon,
	EnvelopeIcon,
	LockClosedIcon,
} from "@heroicons/react/24/solid";
import { supabase } from "@/supabase-client";

const page = () => {
	const [fullname, setFullname] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirPassword, setConfirmPassword] = useState("");
	const [role, setRole] = useState<"admin" | "cashier" | string>("admin");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault();
		setError("");

		if (password !== confirPassword) {
			setError("Passwords do not match!");
		}

		setLoading(true);

		const { data: emails, error } = await supabase.from("profiles").select("*");

		console.log(emails);

		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: fullname, phone: phone, role: role },
			},
		});

		if (signUpError) {
			setError(signUpError.message);
			setLoading(false);
			return;
		}

		if (data.user) {
			const { error: profileError } = await supabase.from("profiles").insert({
				id: data.user.id,
				full_name: fullname,
				phone: phone,
				email: email,
				role: role,
			});

			if (profileError) console.log("Profile save error:", profileError.message);
		}

		setLoading(false);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-green-50 p-4 ">
			{/* <fieldset className=" fieldset w-full">
				<legend className="fieldset-legend text-green-800 text-xl text-center">
					Add User
				</legend>
				<GidrockSwitch
					checked={role == "admin"}
					onChange={(isOn) => setRole(isOn ? "admin" : "cashier")}
					label={role == "admin" ? "Admin" : "Cashier"}
				/>
			</fieldset> */}

			<form
				className="card w-full max-w-md bg-green-100 p-6 shadow-md"
				onSubmit={handleSubmit}
			>
				<h3 className=" text-2xl font-bold text-green-900"> Add User</h3>
				<GidrockInput
					label="Full Name"
					type="text"
					placeholder="e.g Chioma Precious"
					icon={UserIcon}
					value={fullname}
					onChange={setFullname}
					hint="Enter your full name"
				/>

				<GidrockInput
					label="Phone Number"
					type="tel"
					placeholder="e.g 0813 123 4657"
					icon={PhoneIcon}
					value={phone}
					onChange={setPhone}
					hint="Enter a valid phone number"
				/>

				<GidrockInput
					label="Email Address"
					type="email"
					placeholder="e.gidrock@example.com"
					icon={EnvelopeIcon}
					value={email}
					onChange={setEmail}
					hint="Enter a valid phone number"
				/>

				<fieldset className="fieldset w-full">
					<legend className="fieldset-legend text-green-800">Role</legend>
					<select
						className="select mb-6"
						required
						value={role}
						onChange={(e) => setRole(e.target.value)}
					>
						<option>Select Role</option>
						<option value="admin">Admin</option>
						<option value="cashier">Cashier</option>
					</select>
				</fieldset>

				<GidrockInput
					label="Password"
					type="password"
					placeholder="************"
					icon={LockClosedIcon}
					value={password}
					onChange={setPassword}
					hint="8+ characters, 1 number, 1 uppercase"
				/>

				<GidrockInput
					label="Confirm Password"
					type="password"
					placeholder="************"
					icon={LockClosedIcon}
					value={confirPassword}
					onChange={setConfirmPassword}
					hint="Must match password"
				/>

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

				<button
					className="btn w-full bg-green-800 text-white hover:bg-green-900 disabled:opacity-50"
					type="submit"
					disabled={loading}
				>
					{loading ? (
						<span className="loading loading-dots loading-lg"></span>
					) : (
						"Add User"
					)}
				</button>
				<p className="mt-4 text-center text-sm text-gray-700 ">
					{" "}
					Already have an account?{" "}
					<a href="/dashboard/login" className="text-green-800 underline">
						{" "}
						Login{" "}
					</a>
				</p>
			</form>
		</div>
	);
};

export default page;
