"use client";
import orders from "../../../../offline-db/orders.json";
import OverviewCards from "./sections/overviewCards";

const admin = () => {
	console.log(orders);
	return (
		<div>
			<OverviewCards orders={orders} />
		</div>
	);
};

export default admin;
