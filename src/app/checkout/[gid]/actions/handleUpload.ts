import { getCartImage } from "@/components/cartImageStorage";
import { useCartStore } from "@/components/CartContext";
import { supabase } from "@/supabase-client";
import axios from "axios";
import { setProgress } from "./types";

export const handleUpload = async (
	gid: string,
	setProgress: setProgress,
): Promise<Record<string, string> | null> => {
	const { cartItems, tempFiles } = useCartStore.getState();

	try {
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
		if (!supabaseUrl || !supabaseAnonKey) {
			throw new Error("Supabase upload configuration is missing.");
		}

		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();
		if (sessionError) {
			throw new Error(`Could not get Supabase session: ${sessionError.message}`);
		}

		const filePaths: Record<string, string> = {};
		const uploads = await Promise.all(
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
				return { item, file };
			}),
		);
		const loadedBytesByItem: Record<string, number> = {};
		const totalBytes = uploads.reduce((total, { file }) => total + file.size, 0);
		let loadedBytes = 0;

		await Promise.all(
			uploads.map(async ({ item, file }) => {
				const safeItemId = item.id.replace(/[^a-zA-Z0-9_-]/g, "_");
				const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
				const filePath = `${gid}/${safeItemId}-${safeFileName || "upload"}`;

				try {
					const encodedPath = filePath
						.split("/")
						.map(encodeURIComponent)
						.join("/");
					await axios.post(
						`${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/order-files/${encodedPath}`,
						file,
						{
							headers: {
								apikey: supabaseAnonKey,
								Authorization: `Bearer ${session?.access_token ?? supabaseAnonKey}`,
								"Content-Type": file.type || "application/octet-stream",
								"x-upsert": "true",
							},
							onUploadProgress: (event) => {
								const itemLoadedBytes = Math.min(event.loaded, file.size);
								loadedBytes +=
									itemLoadedBytes - (loadedBytesByItem[item.id] ?? 0);
								loadedBytesByItem[item.id] = itemLoadedBytes;
								if (totalBytes > 0) {
									setProgress(Math.round((loadedBytes / totalBytes) * 100));
								}
							},
						},
					);
				} catch (error) {
					const reason = axios.isAxiosError(error)
						? `HTTP ${error.response?.status ?? "network error"}: ${error.message}`
						: error instanceof Error
							? error.message
							: String(error);
					throw new Error(
						`Axios upload failed for ${file.name}: ${reason}`,
					);
				}

				filePaths[item.id] = filePath;
			}),
		);

		setProgress(100);
		return filePaths;
	} catch (error) {
		console.error("Error uploading order files:", error);
		const reason = error instanceof Error ? error.message : String(error);
		alert(`Order files were not uploaded. ${reason}`);
		return null;
	}
};
