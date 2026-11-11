"use client";
import orders from "../../../../offline-db/orders.json";
import OverviewCards from "./sections/overviewCards";
import RecentOrders from "./sections/RecentOrders";

const admin = () => {
	return (
		<div>
			<OverviewCards orders={orders} />
			<RecentOrders orders={orders} />
		</div>
	);
};

export default admin;
