import { CartItem } from "@/components/cartTypes";

export type orders = {
	id: string;
	gid: string;
	customer_name: string;
	email?: string;
	phone: string;
	delivery: string;
	cart_items: CartItem[];
	total_price: number;
	created_at: string;
	status: string;
	address: string;
	localGovernment: string;
	state: string;
	substation?: string | null;
	collection_date?: string | null;
	delivery_ready_at?: string | null;
	payment_method?: string | null;
	payment_reference?: string | null;
};
