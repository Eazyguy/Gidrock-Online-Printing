"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { nigerianStates } from "@/constants/nigerianStates";
import Form from "@/app/checkout/[gid]/Form";
import {
	handlePay,
	handleInterstateWhatsapp,
} from "./actions/handleCheckoutActions";

const checkoutGID = () => {
	const [form, setForm] = useState({
		name: "",
		phoneNumber: "",
		email: "",
		address: "",
		localGovernment: "",
		state: "",
		delivery: "",
	});
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "completed" | "failed"
	>("idle");

	const lgas = nigerianStates.find((s) => s.state == form.state)?.lgas || [];

	const hasMissingRequiredFields =
		!form.name.trim() ||
		!form.address.trim() ||
		!form.email.trim() ||
		!form.state;

	const router = useRouter();
	const params = useParams();
	const gid = params.gid as string;

	useEffect(() => {
		const savedGid = localStorage.getItem("gidrock-checkout-id");
		if (!savedGid || savedGid !== gid || !gid.startsWith("GID-")) {
			router.push("/");
			return;
		}
	});

	const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (form.delivery === "station delivery") {
			handlePay(
				e,
				hasMissingRequiredFields,
				uploadStatus,
				setUploadStatus,
				form,
				gid,
			);
			return;
		}
		if (form.delivery === "interstate delivery") {
			handleInterstateWhatsapp(
				e,
				hasMissingRequiredFields,
				uploadStatus,
				setUploadStatus,
				form,
				gid,
			);
			return;
		}
		e.preventDefault();
		alert("Choose a delivery option");
	};

	return (
		<div className="background flex flex-col justify-center justify-center items-center gap-4">
			<Form
				form={form}
				setForm={setForm}
				lgas={lgas}
				uploadStatus={uploadStatus}
				setUploadStatus={setUploadStatus}
				handleCheckout={handleCheckout}
			/>
		</div>
	);
};

export default checkoutGID;
