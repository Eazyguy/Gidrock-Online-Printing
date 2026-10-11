import { getCartImage } from "@/components/cartImageStorage";
import { useCartStore } from "@/components/CartContext";
import { supabase } from "@/supabase-client";

export const handleUpload = async (
	gid: string,
): Promise<Record<string, string> | null> => {
	const { cartItems, tempFiles } = useCartStore.getState();

	try {
		const filePaths: Record<string, string> = {};
		await Promise.all(
			cartItems.map(async (item) => {
				let file: File | undefined;
				try {
					file = tempFiles[item.id] ?? (await getCartImage(item.id));
				} catch (error) {
					const reason = error instanceof Error ? error.message : String(error);
					throw new Error(
						`Could not read the design file for ${item.product}: ${reason}`,
					);
				}
				if (!file) throw new Error(`No design file was found for ${item.product}`);

				const safeItemId = item.id.replace(/[^a-zA-Z0-9_-]/g, "_");
				const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
				const filePath = `${gid}/${safeItemId}-${safeFileName || "upload"}`;
				console.log(filePath);
				const { error } = await supabase.storage
					.from("order-files")
					.upload(filePath, file, { upsert: true });

				if (error) {
					throw new Error(
						`Supabase upload failed for ${file.name}: ${error.message}`,
					);
				}
				filePaths[item.id] = filePath;
			}),
		);

		return filePaths;
	} catch (error) {
		console.error("Error uploading order files:", error);
		const reason = error instanceof Error ? error.message : String(error);
		alert(`Order files were not uploaded. ${reason}`);
		return null;
	}
};
