"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "./CartContext";
import type { CartItem } from "./cartTypes";
import Image from "next/image";
import { formatCurrency } from "@/app/products/configuration/formatCurrency";
import { getCartImage } from "./cartImageStorage";
import { useRouter } from "next/navigation";
import { generateGID } from "@/app/lib/generateGID";

type CartProps = {
	cartItems: CartItem[];
	setIsCartOpen: (isOpen: boolean) => void;
};

const Cart = ({ cartItems, setIsCartOpen }: CartProps) => {
	const tempFiles = useCartStore((state) => state.tempFiles);
	const clearCart = useCartStore((state) => state.clearCart);
	const [fileUrls, setFileUrls] = useState<Record<string, string>>({});

	useEffect(() => {
		let active = true;
		let urls: Record<string, string> = {};

		const loadImages = async () => {
			const images = await Promise.all(
				cartItems.map(async (item) => {
					const file =
						tempFiles[item.id] ??
						(await getCartImage(item.id).catch(() => undefined));
					return [item.id, file] as const;
				}),
			);

			if (!active) return;

			urls = Object.fromEntries(
				images.flatMap(([itemId, file]) =>
					file ? [[itemId, URL.createObjectURL(file)]] : [],
				),
			);
			setFileUrls(urls);
		};

		void loadImages();

		return () => {
			active = false;
			Object.values(urls).forEach((url) => URL.revokeObjectURL(url));
		};
	}, [cartItems, tempFiles]);

	const removeItem = useCartStore((state) => state.removeItem);
	const total = useCartStore((state) => state.total);
	const startNav = useCartStore((state) => state.startNav);

	const router = useRouter();

	const handleProceed: any = () => {
		if (cartItems.length == 0) return;

		const gid = generateGID();

		localStorage.setItem("gidrock-checkout-id", gid);
		localStorage.setItem(`order_${gid}`, JSON.stringify(cartItems));

		setIsCartOpen(false);

		startNav();
		router.push(`/checkout/${gid}`);
	};

	return (
		<div>
			{cartItems.length === 0 ? (
				"Your cart is empty"
			) : (
				<>
					<button
						type="button"
						onClick={clearCart}
						className="mb-2 rounded bg-red-700 px-3 py-1 text-sm text-white"
					>
						Clear cart
					</button>
					{cartItems.map((item) => (
						<li
							key={item.id}
							className="text-black p-2 border mt-1 border-gray-500 border-x-0 w-full flex gap-2"
						>
							<span className="relative block h-20 w-20 shrink-0">
								{fileUrls[item.id] ? (
									<Image
										src={fileUrls[item.id]}
										fill
										unoptimized
										className="object-cover"
										alt={`${item.product} image preview`}
									/>
								) : (
									<span className="text-xs">No image</span>
								)}
							</span>
							<span>
								<p className="font-bold text-lg">{item.product}</p>
								<span className="flex gap-2 wrap">
									{item.config?.thickness && (
										<p className="text-xs bg-green-700 p-1 rounded full text-white">
											<b>Thickness: </b> {item.config?.thickness}{" "}
										</p>
									)}
									{item.config?.size && (
										<p className="text-xs bg-green-700 p-1 rounded full text-white">
											<b> size: </b> {item.config.size}{" "}
										</p>
									)}
									{item.config?.lamination && (
										<p className="text-xs bg-green-700 p-1 rounded full text-white">
											<b> Lamination: </b> {item.config?.lamination}{" "}
										</p>
									)}
									{item.config?.heightFt !== 0 && (
										<p className="text-xs bg-green-700 p-1 rounded full text-white">
											<b> height: </b> {item.config?.heightFt}{" "}
										</p>
									)}
									{item.config?.widthFt !== 0 && (
										<p className="text-xs bg-green-700 p-1 rounded full text-white">
											<b> width: </b> {item.config?.widthFt}{" "}
										</p>
									)}
								</span>
								<p>
									<b>Quantity:</b>
									{item.config?.qty}
								</p>
								{item.config?.extraNote && (
									<p>
										<b>Other Information: </b>
										{item.config.extraNote}
									</p>
								)}
							</span>

							<span className="self-center relative ml-auto flex flex-col justify-end">
								<p className="text-lg font-bold">{formatCurrency(item.price)}</p>
								<button
									className="bg-red-500 mt-2 text-xs text-white p-1 rounded w-fit self-end"
									onClick={() => removeItem(item.id)}
								>
									Remove
								</button>
							</span>
						</li>
					))}
					<hr className="border-1 border-zinc-300" />
					<div className="text-center text-black mt-4">
						<p className="font-bold text-xl">Total:</p>
						<p className="text-3xl mt-2">{formatCurrency(total)}</p>
					</div>
					<div className="w-full flex justify-center mt-3 ">
						<button
							className="bg-green-800 text-white w-fit p-2 my-2 rounded"
							onClick={handleProceed}
						>
							Proceed to checkout
						</button>
					</div>
				</>
			)}
		</div>
	);
};

export default Cart;
