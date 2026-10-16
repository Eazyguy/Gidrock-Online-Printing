import React, { useState } from "react";
import { nigerianStates } from "@/constants/nigerianStates";
import { FormProps, handleCheckout, lgas } from "./actions/types";

type FormfieldProp = {
	form: FormProps["form"];
	setForm: React.Dispatch<React.SetStateAction<FormProps["form"]>>;
	lgas: string[];
	handleCheckout: handleCheckout;
	uploadStatus: FormProps["uploadStatus"];
	progress: number;
	setUploadStatus: React.Dispatch<
		React.SetStateAction<FormProps["uploadStatus"]>
	>;
};

const Form = ({
	form,
	setForm,
	lgas,
	uploadStatus,
	progress,
	setUploadStatus,
	handleCheckout,
}: FormfieldProp) => {
	return (
		<>
			<p className="font-bold mt-20 text-black text-xl">
				YOUR PERSONAL INFORMATION
			</p>
			<p className="text-sm text-gray-700 line-1/2] text-center font-bold leading-[1]">
				Please note that the information provided here will be used in processing
				your delivery, please be careful filling it and make sure every info
				provided is correct
			</p>

			<form
				method="post"
				className="mx-auto my-10 mt-5 w-full min-w-0 max-w-2xl px-1 text-black font-bold md:text-lg"
			>
				<div className="grid grid-cols-1 items-center gap-x-3 gap-y-4 sm:grid-cols-[10rem_minmax(0,1fr)]">
					<label htmlFor="fullname">Fullname:</label>
					<input
						type="text"
						className="w-full min-w-0 border rounded p-2 outline border-green-700 focus:outline-green-500 focus:outline-2"
						placeholder="Jane Jones"
						id="fullname"
						name="fullname "
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
					/>

					<label htmlFor="phone-number">Phone Number:</label>
					<input
						type="number"
						className="w-full min-w-0 border rounded p-2 outline border-green-700 focus:outline-green-500 focus:outline-2"
						placeholder="0801234567"
						id="phone-number"
						name="phone-number "
						value={form.phoneNumber}
						onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
					/>

					<label htmlFor="email">Email:</label>
					<input
						type="email"
						className="w-full min-w-0 border rounded p-1 outline border-green-700 focus:outline-green-500 focus:outline-2"
						placeholder="gidrock@example.com"
						id="email"
						name="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
					/>

					<label htmlFor="address">Address:</label>
					<input
						type="text"
						className="w-full min-w-0 border rounded p-2 outline border-green-700 focus:outline-green-500 focus:outline-2"
						id="address"
						name="address"
						value={form.address}
						onChange={(e) => setForm({ ...form, address: e.target.value })}
					/>

					<label htmlFor="state">State:</label>
					<select
						name="state"
						id="state"
						value={form.state}
						onChange={(e) => setForm({ ...form, state: e.target.value })}
						className="w-full min-w-0 border-green-700 border outline p-2 rounded text-center focus:outline-green-500"
					>
						<option value="">Select State</option>
						{nigerianStates.map((s) => (
							<option key={s.state} value={s.state}>
								{s.state}
							</option>
						))}
					</select>

					<label htmlFor="local-government">Local Government:</label>
					<select
						name="localGovernment"
						id="local-government"
						value={form.localGovernment}
						onChange={(e) => setForm({ ...form, localGovernment: e.target.value })}
						className="w-full min-w-0 border border-green-700 outline p-2 rounded text-center focus:outline-green-500"
					>
						<option value="">Select LGA</option>
						{form.state ? (
							lgas.map((lga) => (
								<option key={lga} value={lga}>
									{lga}
								</option>
							))
						) : (
							<option value="">Select State first</option>
						)}
					</select>
				</div>
				<div className="mx-auto mt-6 w-full min-w-0">
					<p className="text-center text-xl">DELIVERY OPTIONS</p>
					<div className="w-full min-w-0 text-gray-800 text-sm leading-relaxed whitespace-normal wrap-anywhere">
						<p>We have only two types of delivery:</p>
						<ul className="mt-2 space-y-1.5 list-none">
							<li>
								<span>*</span>
								<b>Station Delivery: </b>We have specified locations where you can
								collect your delivery only available in Imo State
							</li>
							<li>
								<span>*</span>
								<b>InterState Delivery: </b>Delivery outside Imo State
							</li>
						</ul>
						<p className="text-center mt-1 block">Choose from the options below</p>
					</div>
				</div>
				<div className="mt-5 flex w-full min-w-0 flex-wrap justify-center gap-2">
					<label htmlFor="station-delivery" className="cursor-pointer">
						<input
							type="radio"
							name="delivery"
							id="station-delivery"
							className="sr-only peer"
							checked={form.delivery === "station delivery"}
							onChange={() => setForm({ ...form, delivery: "station delivery" })}
						/>
						<div className="bg-green-800 text-white p-2 w-fit rounded peer-checked:bg-green-700 peer-checked:border peer-checked:border-green-500">
							Station Delivery
						</div>
					</label>

					<label htmlFor="interstate-delivery" className="cursor-pointer">
						<input
							type="radio"
							name="delivery"
							id="interstate-delivery"
							className="sr-only peer"
							checked={form.delivery === "interstate delivery"}
							onChange={() => setForm({ ...form, delivery: "interstate delivery" })}
						/>
						<div className="bg-green-800 text-white p-2 w-fit rounded peer-checked:bg-green-700 peer-checked:border peer-checked:border-green-500">
							InterState Delivery
						</div>
					</label>
				</div>
				<div className="flex w-full justify-center mt-10 gap-2">
					<button
						type="button"
						disabled={uploadStatus === "uploading"}
						className="max-w-full rounded border-2 border-green-700 bg-green-400 p-2 text-center hover:bg-green-600"
						onClick={handleCheckout}
					>
						{uploadStatus === "uploading"
							? "Uploading order..."
							: uploadStatus === "completed"
								? "Completed"
								: form.delivery == "station delivery"
									? "Checkout and Payment"
									: form.delivery == "interstate delivery"
										? "Proceed to WhatsApp to complete your order"
										: "Choose a delivery option"}
					</button>
				</div>
				{uploadStatus === "uploading" && (
					<p className="mt-2 text-center text-sm" role="status">
						Uploading files: {progress}%
					</p>
				)}
			</form>
		</>
	);
};

export default Form;
