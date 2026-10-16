"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { nigerianStates } from "@/constants/nigerianStates";
import Form from "@/app/checkout/[gid]/Form";
import {
	handlePay,
	handleInterstateWhatsapp,
} from "./actions/handleCheckoutActions";
import { useCartStore } from "@/components/CartContext";

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

	const [progress, setProgress] = useState<number>(0);

	const lgas = nigerianStates.find((s) => s.state == form.state)?.lgas || [];

	const hasMissingRequiredFields =
		!form.name.trim() ||
		!form.address.trim() ||
		!form.email.trim() ||
		!form.state;

	const router = useRouter();
	const params = useParams();
	const gid = params.gid as string;
	const startNav = useCartStore((state) => state.startNav);

	useEffect(() => {
		const savedGid = localStorage.getItem("gidrock-checkout-id");
		if (!savedGid || savedGid !== gid || !gid.startsWith("GID-")) {
			startNav();
			router.push("/");
			return;
		}
	}, [gid, router, startNav]);

	const handleCheckout = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (form.delivery === "station delivery") {
			handlePay(
				e,
				hasMissingRequiredFields,
				uploadStatus,
				setUploadStatus,
				form,
				gid,
				setProgress,
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
				setProgress,
			);
			return;
		}
		e.preventDefault();
		alert("Choose a delivery option");
	};

	return (
		<div className="background flex flex-col justify-center items-center gap-4 w-full">
			<Form
				form={form}
				setForm={setForm}
				lgas={lgas}
				uploadStatus={uploadStatus}
				setUploadStatus={setUploadStatus}
				handleCheckout={handleCheckout}
				progress={progress}
			/>
		</div>
	);
};

export default checkoutGID;
