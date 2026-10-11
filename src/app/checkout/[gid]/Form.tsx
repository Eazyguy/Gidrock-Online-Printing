import React, { useState } from "react";
import { nigerianStates } from "@/constants/nigerianStates";
import { FormProps, handleCheckout, lgas } from "./actions/types";

type FormfieldProp = {
	form: FormProps["form"];
	setForm: React.Dispatch<React.SetStateAction<FormProps["form"]>>;
	lgas: string[];
	handleCheckout: handleCheckout;
	uploadStatus: FormProps["uploadStatus"];
	setUploadStatus: React.Dispatch<
		React.SetStateAction<FormProps["uploadStatus"]>
	>;
};

const Form = ({
	form,
	setForm,
	lgas,
	uploadStatus,
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
				className="mt-5 my-10     text-black font-bold md:text-lg"
			>
				<label htmlFor="fullname"> Fullname: </label>{" "}
				<input
					type="text"
					className="border rounded p-1 outline none border-green-700 focus:outline-green-500 focus:outline-2 ms-3 w-80 md:w-[400px] ms-11"
					placeholder="Jane Jones"
					id="fullname"
					name="fullname "
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
				/>
				<br />
				<br />
				<label htmlFor="phone-number"> Phone Number: </label>{" "}
				<input
					type="number"
					className="border rounded p-1 outline none border-green-700 focus:outline-green-500 focus:outline-2 ms-1 w-80 md:w-[400px]"
					placeholder="0801234567"
					id="phone-number"
					name="phone-number "
					value={form.phoneNumber}
					onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
				/>
				<br />
				<br />
				<label htmlFor="email"> Email: </label>{" "}
				<input
					type="email"
					className="border rounded p-1 outline border-green-700 focus:outline-green-500 focus:outline-2 ms-1 w-80 md:w-[400px] ms-19"
					placeholder="gidrock@example.com"
					id="email"
					name="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
				/>
				<br />
				<br />
				<label htmlFor="fullname"> Address: </label>{" "}
				<input
					type="text"
					className="border rounded p-1 outline none border-green-700 focus:outline-green-500 focus:outline-2 ms-3 w-80 md:w-[400px] ms-13"
					id="address"
					name="address"
					value={form.address}
					onChange={(e) => setForm({ ...form, address: e.target.value })}
				/>
				<br />
				<br />
				<label htmlFor="state"> State: </label>{" "}
				<select
					name="state"
					id="state"
					value={form.state}
					onChange={(e) => setForm({ ...form, state: e.target.value })}
					className="border border-green-700 border-1 outline w-50 text-center text-normal p-1 rounded ms-20 focus:outline-green-500"
				>
					<option value={""}>Select State</option>
					{nigerianStates.map((s) => (
						<option key={s.state} value={s.state}>
							{s.state}
						</option>
					))}
				</select>
				<br />
				<br />
				<label htmlFor="state"> Local Government: </label>{" "}
				<select
					name="state"
					id="state"
					value={form.localGovernment}
					onChange={(e) => setForm({ ...form, localGovernment: e.target.value })}
					className="border border-green-700 border-1 outline w-50 text-center text-normal p-1 rounded ms-0 focus:outline-green-500"
				>
					<option value={""}>Select LGA</option>
					{form.state && form.state !== "" ? (
						lgas.map((lga) => <option key={lga}>{lga}</option>)
					) : (
						<option>Select State first</option>
					)}
				</select>
				<br />
				<br />
				<p className="text-xl text-center">DELIVERY OPTIONS</p>
				<p className="text-gray-800 text-sm">
					We have only two types of delivery: <br />*<b>Station Delivery: </b>we have
					specified locations where you can collect your delivery only available in
					Imo State <br />*<b>InterState Delivery: </b>Delivery outside Imo State
					<span className="text-center mt-1 block">
						Choose from the options below
					</span>
				</p>
				<div className="flex gap-2 justify-center mt-5">
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
				<div className="flex w-full justify-center mt-10">
					<button
						type="button"
						disabled={uploadStatus === "uploading"}
						className="bg-green-400 w-fit border border-green-700 border-2 p-2 rounded hover:bg-green-600"
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
			</form>
		</>
	);
};

export default Form;
