import "server-only";

import { supabase } from "@/supabase-client";

export const getDatabaseData = async (
	gid: string,
): Promise<ReceiptOrder | null> => {
	const { data, error } = await supabase
		.from("orders")
		.select()
		.eq("gid", gid)
		.maybeSingle();

	if (error) {
		console.error("Error fetching receipt order:", error);
		throw new Error("Unable to load receipt data.");
	}

	return data;
};

export type ReceiptOrder = {
	gid: string;
	customer_name: string;
	phone: string;
	email: string;
	address: string;
	state: string;
	localGovernment: string;
	delivery: string;
	cart_items: {
		id: string;
		product: string | null;
		price?: number;
		config: {
			qty: number;
			size: string | null;
			thickness: string | null;
			lamination: string | null;
			widthFt: number;
			heightFt: number;
			extraNote: string;
		} | null;
	}[];
	total_price: number;
	status: string;
	created_at?: string;
};
