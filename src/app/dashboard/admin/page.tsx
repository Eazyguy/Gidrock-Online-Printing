"use client";
import orders from "../../../../offline-db/orders.json";
import OverviewCards from "./sections/overviewCards";
import RecentOrders from "./sections/RecentOrders";

const admin = () => {
	return (
		<div>
			<OverviewCards orders={orders} />
			<RecentOrders orders={orders.slice(0, 10)} />
		</div>
	);
};

export default admin;
