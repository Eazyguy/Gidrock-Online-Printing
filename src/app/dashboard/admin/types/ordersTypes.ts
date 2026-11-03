import { CartItem } from "@/components/cartTypes";

export type orders = {
	id: string;
	gid: string;
	customer_name: string;
	phone: string;
	delivery: string;
	cart_items: CartItem[];
	total_price: number;
	created_at: string;
	status: string;
	address: string;
	localGovernment: string;
	state: string;
};
