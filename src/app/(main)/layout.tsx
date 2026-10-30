import React from "react";
import Nav from "@/components/Nav";
import { CartProvider } from "@/components/CartContext";
const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<>
			<CartProvider>
				<Nav />
				{children}
			</CartProvider>
		</>
	);
};

export default layout;
