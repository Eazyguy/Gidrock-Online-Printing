import { notFound } from "next/navigation";
import { getDatabaseData } from "./actions";
import Receipt from "@/components/Receipt";

const ReceiptPage = async ({
	params,
	searchParams,
}: {
	params: Promise<{ gid: string }>;
	searchParams: Promise<{ reference?: string | string[] }>;
}) => {
	const [{ gid }, { reference }] = await Promise.all([params, searchParams]);
	const order = await getDatabaseData(gid);

	if (!order) notFound();

	return (
		<Receipt
			order={order}
			transactionReference={
				typeof reference === "string" ? reference : undefined
			}
		/>
	);
};

export default ReceiptPage;
