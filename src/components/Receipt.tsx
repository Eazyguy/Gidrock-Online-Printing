import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { formatCurrency } from "@/app/products/configuration/formatCurrency";
import type { ReceiptOrder } from "@/app/receipt/[gid]/actions";

const Receipt = ({
	order,
	transactionReference,
}: {
	order: ReceiptOrder;
	transactionReference?: string;
}) => {
	const isPaid = order.status === "completed";
	const receiptDate = order.created_at ? new Date(order.created_at) : null;

	return (
		<div className="background py-40 print:py-2 flex justify-center items-center">
			<div className="bg-white rounded-xl shadow-2xl shadow-gray-800 w-full max-w-3xl">
				<div className="bg-green-800 p-5 rounded-xl flex justify-between items-center">
					<img src="/uu.webp" alt="icon" width={150} height={150} />
					<div className=" font-bold text-white">
						<p className="text-2xl">RECEIPT</p>
						{receiptDate && !Number.isNaN(receiptDate.getTime()) && (
							<p>
								{receiptDate.toLocaleDateString("en-NG", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</p>
						)}
					</div>
				</div>
				<div className="flex p-5 justify-between">
					<div>
						<p className="text-gray-500 mb-2">BILL TO</p>
						<p className="text-black text-xl font-bold">{order.customer_name}</p>
						<p className="text-slate-700">{order.phone}</p>
						<p className="text-slate-700">{order.email}</p>
						<p className="text-slate-700">
							{[order.address, order.localGovernment, order.state]
								.filter(Boolean)
								.join(", ")}
						</p>
					</div>
					<div>
						<p className="text-gray-500">RECEIPT NO. </p>
						<p className="font-bold text-black">{order.gid}</p>
					</div>
				</div>
				<div
					className={`mt-2 border p-5 mx-5 rounded-lg ${isPaid ? "bg-green-500/30 border-green-600" : "bg-amber-100 border-amber-500"}`}
				>
					<p
						className={`text-lg font-bold flex items-center ${isPaid ? "text-green-600" : "text-amber-700"}`}
					>
						{isPaid && <CheckBadgeIcon width={40} />}
						Payment {isPaid ? "Confirmed" : order.status}
					</p>
					{transactionReference && (
						<p className="mt-2 text-sm text-gray-700">
							<b>Paystack reference:</b> {transactionReference}
						</p>
					)}
				</div>
				<p className="p-5 text-black font-bold">ITEM DETAILS</p>
				<div className="rounded-lg overflow-clip mx-5">
					<table className="w-full text-left text-black">
						<thead className="text-gray-700 bg-gray-300 h-12">
							<tr>
								<th className="px-3">Item</th>
								<th className="px-3">Qty</th>
								<th className="px-3 text-right">Price</th>
							</tr>
						</thead>
						<tbody>
							{order.cart_items.map((item) => (
								<tr key={item.id} className="border-b border-gray-200">
									<td className="px-3 py-3">
										<p className="font-semibold">{item.product || "Product"}</p>
										<p className="text-sm text-gray-600">
											{[
												item.config?.size,
												item.config?.thickness,
												item.config?.lamination,
												item.config?.widthFt && item.config?.heightFt
													? `${item.config.widthFt} × ${item.config.heightFt} ft`
													: null,
											]
												.filter(Boolean)
												.join(" · ")}
										</p>
									</td>
									<td className="px-3 py-3">{item.config?.qty ?? "—"}</td>
									<td className="px-3 py-3 text-right">{formatCurrency(item.price)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<hr className="m-5 border border-gray-400" />
				<div className="flex mx-5 justify-end">
					<div className="px-2  py-4 border border-green-600 bg-green-500/30 w-fit rounded leading-0">
						<p className="text-sm text-green-700 text-right font-bold">Order Total</p>
						<p className="text-green-800 text-3xl font-bold text-right">
							{formatCurrency(order.total_price)}
						</p>
						<span className="text-black text-[0.6rem] font-bold me-2">
							{order.delivery}
						</span>
					</div>
				</div>
				<div className="text-sm flex justify-between p-5 mt-5 bg-gray-400 rounded-lg">
					<div>
						<p className="text-black">
							Order status:{" "}
							<b className="text-green-800">{order.status.toUpperCase()}</b>
						</p>
						<p className="text-black">
							Your Order is being processed and will be delivered <b>within 48hours</b>
						</p>
					</div>
					<div className="text-black">
						<p className="font-bold">Gidrock online print</p>
						<p>07017897866, 09133532790, 07070647836</p>
						<p>hello@gidrockprint.ng</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Receipt;
