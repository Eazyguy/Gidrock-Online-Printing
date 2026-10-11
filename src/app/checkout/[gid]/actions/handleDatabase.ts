import { handleUpload } from "./handleUpload";
import { supabase } from "@/supabase-client";
import { FormProps } from "./types";
import { CartItem } from "@/components/cartTypes";

export const handleDatabase = async (
	form: FormProps["form"],
	gid: string,
	cartItems: CartItem[],
	total: number,
): Promise<boolean> => {
	const { name, phoneNumber, ...formData } = form;

	const { data, error: lookupError } = await supabase
		.from("orders")
		.select("*")
		.eq("gid", gid)
		.maybeSingle();

	if (lookupError) {
		console.error("Error checking existing order:", lookupError);
		alert("There was an error checking your order. Please try again.");
		return false;
	}

	if (data) {
		alert("Order already exists. Please check your order history.");
		return false;
	}

	const uploadedFilePaths = await handleUpload(gid);
	if (!uploadedFilePaths) return false;

	const orderData = {
		gid,
		...formData,
		customer_name: name.trim(),
		phone: phoneNumber,
		status: "pending",
		cart_items: cartItems.map((item) => ({
			...item,
			file_path: uploadedFilePaths[item.id] ?? null,
		})),
		total_price: total,
	};

	console.log(orderData);

	const { error } = await supabase.from("orders").insert([orderData]);

	if (error) {
		console.error("Error inserting order:", error);
		alert("There was an error processing your order. Please try again.");
		return false;
	}

	return true;
};
