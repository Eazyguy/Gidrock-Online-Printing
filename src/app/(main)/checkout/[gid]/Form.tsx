import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { addDays, format, isBefore, startOfDay } from "date-fns";
import { supabase } from "@/supabase-client";
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
	const [fullyBookedDates, setFullyBookedDates] = useState<Date[]>([]);
	const stationOptions = [
		"Federal Polytechnic Nekede",
		"Mbaise Road",
		"Cherubim Junction Wetheral",
	];

	useEffect(() => {
		let active = true;
		const loadBookings = async () => {
			const earliest = startOfDay(addDays(new Date(), 2));
			const [ordersResult, capacityResult] = await Promise.all([
				supabase
					.from("orders")
					.select("collection_date")
					.gte("collection_date", format(earliest, "yyyy-MM-dd")),
				supabase
					.from("collection_capacity")
					.select("collection_date, capacity")
					.gte("collection_date", format(earliest, "yyyy-MM-dd")),
			]);
			if (!active) return;
			const counts = new Map<string, number>();
			(ordersResult.data ?? []).forEach((row) => {
				if (!row.collection_date) return;
				counts.set(row.collection_date, (counts.get(row.collection_date) ?? 0) + 1);
			});
			const configuredCapacity = new Map(
				(capacityResult.data ?? []).map((row) => [
					row.collection_date,
					row.capacity,
				]),
			);
			const booked: Date[] = [];
			counts.forEach((count, date) => {
				if (count >= (configuredCapacity.get(date) ?? 10)) {
					booked.push(startOfDay(new Date(`${date}T00:00:00`)));
				}
			});
			setFullyBookedDates(booked);
		};
		void loadBookings();
		return () => {
			active = false;
		};
	}, []);

	const earliestCollection = (() => {
		let date = startOfDay(addDays(new Date(), 2));
		while ([0, 5, 6].includes(date.getDay())) date = addDays(date, 1);
		return date;
	})();

	const isUnavailableDate = (date: Date) =>
		isBefore(date, earliestCollection) ||
		[0, 5, 6].includes(date.getDay()) ||
		fullyBookedDates.some((booked) => format(booked, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));

	const selectDelivery = (delivery: string) => {
		setForm({
			...form,
			delivery,
			state: delivery === "station delivery" ? "Imo" : form.state,
			substation: delivery === "station delivery" ? form.substation : "",
		});
	};

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
				className="mx-auto my-10 mt-5 w-full min-w-0 max-w-3xl rounded-3xl border border-green-100 bg-white/95 px-5 py-7 text-black shadow-2xl md:px-8"
			>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<label htmlFor="fullname" className="form-control">
						<span className="label-text mb-1 font-bold">Full name</span>
					<input
						type="text"
						className="input input-bordered w-full border-green-700 focus:border-green-700"
						placeholder="Jane Jones"
						id="fullname"
						name="fullname "
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
					/>
					</label>
					<label htmlFor="phone-number" className="form-control">
						<span className="label-text mb-1 font-bold">Phone number</span>
					<input
						type="number"
						className="input input-bordered w-full border-green-700 focus:border-green-700"
						placeholder="0801234567"
						id="phone-number"
						name="phone-number "
						value={form.phoneNumber}
						onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
					/>
					</label>
					<label htmlFor="email" className="form-control">
						<span className="label-text mb-1 font-bold">Email</span>
					<input
						type="email"
						className="input input-bordered w-full border-green-700 focus:border-green-700"
						placeholder="gidrock@example.com"
						id="email"
						name="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
					/>
					</label>
					<label htmlFor="address" className="form-control">
						<span className="label-text mb-1 font-bold">Address</span>
					<input
						type="text"
						className="input input-bordered w-full border-green-700 focus:border-green-700"
						id="address"
						name="address"
						value={form.address}
						onChange={(e) => setForm({ ...form, address: e.target.value })}
					/>
					</label>
					<label htmlFor="state" className="form-control">
						<span className="label-text mb-1 font-bold">State</span>
					<select
						name="state"
						id="state"
						value={form.state}
						onChange={(e) => setForm({ ...form, state: e.target.value })}
						disabled={form.delivery === "station delivery"}
						className="select select-bordered w-full border-green-700"
					>
						<option value="">Select State</option>
						{nigerianStates.map((s) => (
							<option key={s.state} value={s.state}>
								{s.state}
							</option>
						))}
					</select>
					</label>
					<label htmlFor="local-government" className="form-control">
						<span className="label-text mb-1 font-bold">Local government</span>
					<select
						name="localGovernment"
						id="local-government"
						value={form.localGovernment}
						onChange={(e) => setForm({ ...form, localGovernment: e.target.value })}
						className="select select-bordered w-full border-green-700"
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
					</label>
				</div>
				<div className="mx-auto mt-8 w-full min-w-0">
					<p className="text-center text-xl font-bold text-green-900">DELIVERY OPTIONS</p>
					<div className="w-full min-w-0 text-gray-800 text-sm leading-relaxed whitespace-normal wrap-anywhere">
						<p>We have only two types of delivery:</p>
						<ul className="mt-2 space-y-1.5 list-none">
							<li>
								<span>*</span>
								<b> Station pickup: </b>Available only in Imo State at a selected substation. Collection is available Monday–Thursday after 48 hours.
							</li>
							<li>
								<span>*</span>
								<b> Interstate delivery: </b>Delivery outside Imo State. The order will be ready after 48 hours.
							</li>
						</ul>
						<p className="text-center mt-1 block">Choose from the options below</p>
					</div>
				</div>
				<div className="mt-5 grid w-full gap-3 sm:grid-cols-2">
					<label htmlFor="station-delivery" className="cursor-pointer">
						<input
							type="radio"
							name="delivery"
							id="station-delivery"
							className="sr-only peer"
							checked={form.delivery === "station delivery"}
							onChange={() => selectDelivery("station delivery")}
						/>
						<div className="h-full rounded-2xl border-2 border-green-200 bg-green-50 p-4 text-center text-green-900 peer-checked:border-green-700 peer-checked:bg-green-700 peer-checked:text-white">
							<b>Station pickup</b>
							<p className="mt-1 text-xs">Pay online and collect from Imo State</p>
						</div>
					</label>

					<label htmlFor="interstate-delivery" className="cursor-pointer">
						<input
							type="radio"
							name="delivery"
							id="interstate-delivery"
							className="sr-only peer"
							checked={form.delivery === "interstate delivery"}
							onChange={() => selectDelivery("interstate delivery")}
						/>
						<div className="h-full rounded-2xl border-2 border-green-200 bg-green-50 p-4 text-center text-green-900 peer-checked:border-green-700 peer-checked:bg-green-700 peer-checked:text-white">
							<b>Interstate delivery</b>
							<p className="mt-1 text-xs">Complete arrangement through WhatsApp</p>
						</div>
					</label>
				</div>

				{form.delivery === "station delivery" && (
					<div className="mt-6 grid gap-5 rounded-2xl border border-green-100 bg-green-50 p-4 md:grid-cols-[1fr_260px]">
						<div>
							<label htmlFor="substation" className="form-control">
								<span className="label-text mb-1 font-bold text-green-900">Choose a substation</span>
								<select
									id="substation"
									value={form.substation}
									onChange={(event) =>
										setForm({ ...form, substation: event.target.value })
									}
									className="select select-bordered w-full border-green-700"
									required
								>
									<option value="">Select substation</option>
									{stationOptions.map((station) => (
										<option key={station} value={station}>{station}</option>
									))}
								</select>
							</label>
							<div className="mt-4 rounded-xl bg-white p-3">
								<p className="mb-2 text-sm font-bold text-green-900">Choose collection date</p>
								<DayPicker
									mode="single"
									selected={form.collectionDate ? new Date(`${form.collectionDate}T00:00:00`) : undefined}
									onSelect={(date) =>
										date && setForm({ ...form, collectionDate: format(date, "yyyy-MM-dd") })
									}
									disabled={isUnavailableDate}
									modifiers={{ fullyBooked: fullyBookedDates, available: (date) => !isUnavailableDate(date) }}
									modifiersClassNames={{
										fullyBooked: "!bg-red-500 !text-white rounded-lg",
										available: "!bg-green-200 !text-green-900 rounded-lg",
									}}
									startMonth={earliestCollection}
								/>
							</div>
						</div>
						<div className="rounded-xl bg-green-900 p-4 text-white">
							<p className="font-bold">Collection details</p>
							<p className="mt-3 text-sm leading-6">
								Collection is only from Monday to Thursday.
								<br />
								Orders become ready 48 hours after placing.
								<br />
								Red dates are fully booked.
							</p>
							{form.collectionDate && (
								<p className="mt-4 rounded-lg bg-white px-3 py-2 text-sm font-bold text-green-900">
									Selected: {format(new Date(`${form.collectionDate}T00:00:00`), "EEEE, MMM d, yyyy")}
								</p>
							)}
						</div>
					</div>
				)}

				{form.delivery === "interstate delivery" && (
					<p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
						Your order will be ready for dispatch 48 hours after it is placed. Final delivery arrangement will continue on WhatsApp.
					</p>
				)}

				<div className="mt-8 flex w-full justify-center gap-2">
					<button
						type="button"
						disabled={
							uploadStatus === "uploading" || uploadStatus === "processing"
						}
						className="max-w-full rounded border-2 border-green-700 bg-green-400 p-2 text-center hover:bg-green-600"
						onClick={handleCheckout}
					>
						{uploadStatus === "uploading"
							? "Uploading order..."
							: uploadStatus === "processing"
								? "Payment in progress..."
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
