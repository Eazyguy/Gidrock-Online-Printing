"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { formatCurrency } from "@/app/(main)/products/configuration/formatCurrency";
import type { orders } from "../types/ordersTypes";
import dayjs from "dayjs";
import { initializeTransaction, verifyTransaction } from "@/app/(main)/payment/actions";

type Props = {
	order: orders | null;
	onClose: () => void;
};

export default function OrderModal({ order, onClose }: Props) {
	const [downloading, setDownloading] = useState<string | null>(null);
	const [updating, setUpdating] = useState(false);
	const [actionError, setActionError] = useState("");
	const [displayStatus, setDisplayStatus] = useState(order?.status ?? "");

	useEffect(() => {
		setDisplayStatus(order?.status ?? "");
	}, [order]);

	useEffect(() => {
		if (!order) return;
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		window.addEventListener("keydown", closeOnEscape);
		return () => window.removeEventListener("keydown", closeOnEscape);
	}, [order, onClose]);

	useEffect(() => {
		if (document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]')) return;
		const script = document.createElement("script");
		script.src = "https://js.paystack.co/v2/inline.js";
		script.async = true;
		document.head.appendChild(script);
	}, []);

	const updateStatus = async (status: "completed" | "delivered", manual = false) => {
		if (!order) return;
		setUpdating(true);
		setActionError("");
		try {
			const updates: Record<string, string> = { status };
			if (manual && status === "completed") {
				updates.payment_method = "manual";
				updates.payment_reference = `manual-${order.gid}-${Date.now()}`;
			}
			const { error } = await supabase
				.from("orders")
				.update(updates)
				.eq("gid", order.gid);
			if (error) throw error;
			order.status = status;
			setDisplayStatus(status);
			if (manual) {
				order.payment_method = "manual";
				order.payment_reference = updates.payment_reference;
			}
		} catch (error) {
			setActionError(error instanceof Error ? error.message : "Could not update order.");
		} finally {
			setUpdating(false);
		}
	};

	const continuePaystack = async () => {
		if (!order) return;
		setUpdating(true);
		setActionError("");
		try {
			if (!window.PaystackPop) throw new Error("Paystack is still loading.");
			const setup = await initializeTransaction(order.email ?? "", order.total_price, order.gid);
			if ("error" in setup) throw new Error(setup.error);
			const popup = new window.PaystackPop();
			popup.resumeTransaction(setup.access_code, {
				onSuccess: async (transaction) => {
					const verification = await verifyTransaction(transaction.reference, order.gid);
					if ("error" in verification) {
						setActionError(verification.error ?? "Could not verify the payment.");
					} else {
						order.status = "completed";
						setDisplayStatus("completed");
						order.payment_method = "paystack";
						order.payment_reference = transaction.reference;
					}
					setUpdating(false);
				},
				onCancel: () => setUpdating(false),
				onError: (error) => {
					setActionError(error.message);
					setUpdating(false);
				},
			});
		} catch (error) {
			setActionError(error instanceof Error ? error.message : "Could not continue payment.");
			setUpdating(false);
		}
	};

	if (!order) return null;

	const downloadFile = async (path: string, name: string) => {
		setDownloading(path);
		try {
			const { data, error } = await supabase.storage
				.from("order-files")
				.createSignedUrl(path, 60);
			if (error || !data?.signedUrl) throw error ?? new Error("Could not create download link");
			const link = document.createElement("a");
			link.href = data.signedUrl;
			link.download = name;
			link.click();
		} catch (error) {
			console.error("Could not download attached file:", error);
		} finally {
			setDownloading(null);
		}
	};

	const attachedFiles = order.cart_items.flatMap((item) =>
		(item.config?.designs ?? []).flatMap((design) => {
			const path =
				(design as typeof design & { file_path?: string }).file_path;
			if (!path) return [];

			const rawSide = String(design.side || "").trim();
			const sideLabel = rawSide
				? rawSide.charAt(0).toUpperCase() + rawSide.slice(1).toLowerCase()
				: "Front";
			const name = design.fileName || `${item.product || "Design"} file`;
			return [{
				path,
				name,
				side: sideLabel,
				product: item.product || "Product",
				lamination: design.lamination,
			}];
		}),
	);
	const legacyFiles = order.cart_items.flatMap((item) => {
		const itemWithPath = item as typeof item & { file_path?: string };
		return itemWithPath.file_path &&
			!attachedFiles.some((file) => file.path === itemWithPath.file_path)
			? [{
				path: itemWithPath.file_path,
				name: item.config?.fileName || `${item.product || "Order"}-legacy-file`,
				side: "Legacy file",
				product: item.product || "Product",
				lamination: item.config?.lamination || null,
			}]
			: [];
	});
	const files = [...attachedFiles, ...legacyFiles];

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
			role="dialog"
			aria-modal="true"
			onMouseDown={(event) => event.target === event.currentTarget && onClose()}
		>
			<div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
				<div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-4">
					<div>
						<p className="text-xs font-semibold uppercase tracking-wide text-green-700">Order details</p>
						<h2 className="text-xl font-bold text-gray-900">{order.gid}</h2>
					</div>
					<button type="button" onClick={onClose} className="btn btn-circle btn-sm border-0 bg-gray-100 text-xl">×</button>
				</div>

				<div className="grid gap-6 p-6 md:grid-cols-2">
					<section>
						<h3 className="mb-3 font-bold text-green-900">Customer</h3>
						<dl className="space-y-2 text-sm text-gray-700">
							<div><dt className="font-semibold text-gray-900">Name</dt><dd>{order.customer_name}</dd></div>
							{order.email && <div><dt className="font-semibold text-gray-900">Email</dt><dd>{order.email}</dd></div>}
							<div><dt className="font-semibold text-gray-900">Phone</dt><dd>{order.phone}</dd></div>
							<div><dt className="font-semibold text-gray-900">Address</dt><dd>{order.address}, {order.localGovernment}, {order.state}</dd></div>
							<div><dt className="font-semibold text-gray-900">Delivery</dt><dd>{order.delivery}</dd></div>
						</dl>
					</section>

					<section>
						<h3 className="mb-3 font-bold text-green-900">Order</h3>
						<dl className="space-y-2 text-sm text-gray-700">
							<div><dt className="font-semibold text-gray-900">Status</dt><dd className="capitalize">{displayStatus}</dd></div>
							<div><dt className="font-semibold text-gray-900">Placed</dt><dd>{dayjs(order.created_at).format("MMM D, YYYY h:mm A")}</dd></div>
							<div><dt className="font-semibold text-gray-900">Total</dt><dd className="text-lg font-bold text-green-800">{formatCurrency(order.total_price)}</dd></div>
							{order.substation && <div><dt className="font-semibold text-gray-900">Pickup point</dt><dd>{order.substation}</dd></div>}
							{order.collection_date && <div><dt className="font-semibold text-gray-900">Collection date</dt><dd>{dayjs(order.collection_date).format("dddd, MMM D, YYYY")}</dd></div>}
							{order.delivery_ready_at && <div><dt className="font-semibold text-gray-900">Ready after</dt><dd>{dayjs(order.delivery_ready_at).format("MMM D, YYYY h:mm A")}</dd></div>}
						</dl>
					</section>
				</div>

				<div className="px-6 pb-6">
					{actionError && (
						<div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
							{actionError}
						</div>
					)}
					<div className="mb-6 flex flex-wrap gap-2">
						{["pending", "failed", "cancelled"].includes(displayStatus) && (
							<>
								<button
									type="button"
									disabled={updating}
									onClick={() => void continuePaystack()}
									className="btn border-0 bg-green-700 text-white hover:bg-green-800"
								>
									Continue with Paystack
								</button>
								<button
									type="button"
									disabled={updating}
									onClick={() => void updateStatus("completed", true)}
									className="btn border border-green-700 bg-white text-green-800 hover:bg-green-50"
								>
									Mark as manually paid
								</button>
							</>
						)}
						{displayStatus === "completed" && (
							<button
								type="button"
								disabled={updating}
								onClick={() => void updateStatus("delivered")}
								className="btn border-0 bg-blue-700 text-white hover:bg-blue-800"
							>
								Mark as delivered
							</button>
						)}
						{displayStatus === "delivered" && (
							<span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
								Order delivered
							</span>
						)}
					</div>
					<h3 className="mb-3 font-bold text-green-900">Products</h3>
					<div className="space-y-3">
						{order.cart_items.map((item) => (
							<div key={item.id} className="rounded-xl border border-green-100 bg-green-50 p-4">
								<div className="flex justify-between gap-3">
									<p className="font-bold text-gray-900">{item.product}</p>
									<p className="font-bold text-green-800">{formatCurrency(item.price ?? 0)}</p>
								</div>
								<div className="mt-2 grid gap-1 text-sm text-gray-700 sm:grid-cols-2">
									{item.config?.size && <p><b>Size:</b> {item.config.size}</p>}
									{item.config?.qty && <p><b>Quantity:</b> {item.config.qty}</p>}
									{item.config?.thickness && <p><b>Thickness:</b> {item.config.thickness}</p>}
									{item.config?.lamination && <p><b>Lamination:</b> {item.config.lamination}</p>}
									{item.config?.shirtType && <p><b>Shirt type:</b> {item.config.shirtType}</p>}
									{item.config?.widthFt && <p><b>Width:</b> {item.config.widthFt} ft</p>}
									{item.config?.heightFt && <p><b>Height:</b> {item.config.heightFt} ft</p>}
									{item.config?.customNote && <p className="sm:col-span-2"><b>Note:</b> {item.config.customNote}</p>}
									{item.config?.extraNote && <p className="sm:col-span-2"><b>Extra note:</b> {item.config.extraNote}</p>}
								</div>
							</div>
						))}
					</div>

					<h3 className="mb-3 mt-6 font-bold text-green-900">Attached files</h3>
					{files.length ? (
						<div className="space-y-2">
							{files.map((file) => (
								<div key={file.path} className="flex items-center gap-3 rounded-lg border px-3 py-3">
									<span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
										file.side === "Front"
											? "bg-green-100 text-green-800"
											: file.side === "Back"
												? "bg-blue-100 text-blue-800"
												: file.side === "Extra"
													? "bg-purple-100 text-purple-800"
													: "bg-gray-100 text-gray-700"
									}`}>
										{file.side}
									</span>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-semibold text-gray-900">{file.name}</p>
										<p className="text-xs text-gray-500">
											{file.product}
											{file.lamination ? ` · ${file.lamination} lamination` : ""}
										</p>
									</div>
									<button
										type="button"
										disabled={downloading === file.path}
										onClick={() => void downloadFile(file.path, file.name)}
										className="shrink-0 rounded-lg border border-green-700 px-3 py-2 text-xs font-bold text-green-800 hover:bg-green-50 disabled:opacity-60"
									>
										{downloading === file.path ? "Preparing…" : "Download"}
									</button>
								</div>
							))}
						</div>
					) : (
						<p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">No attached files.</p>
					)}
				</div>
			</div>
		</div>
	);
}
