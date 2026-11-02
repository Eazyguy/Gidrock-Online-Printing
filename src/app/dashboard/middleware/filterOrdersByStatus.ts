export const filterOrdersByStatus = (status: string, orders: any) =>
	orders.filter((i: any) => i.status == status);
