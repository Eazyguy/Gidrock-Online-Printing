import { getCartImage, getCartImageKey } from "@/components/cartImageStorage";
import { useCartStore } from "@/components/CartContext";
import { supabase } from "@/supabase-client";
import axios from "axios";
import { setProgress } from "./types";

export const handleUpload = async (
  gid: string,
  setProgress: setProgress,
): Promise<Record<string, Record<string, string>> | null> => {
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
      throw new Error(
        `Could not get Supabase session: ${sessionError.message}`,
      );
    }

    const filePaths: Record<string, Record<string, string>> = {};
    const uploads = await Promise.all(
      cartItems.flatMap((item) => {
        const designs = item.config?.designs ?? [];
        if (designs.length === 0) {
          return [
            (async () => {
              let file: File | undefined;
              try {
                file = tempFiles[item.id] ?? (await getCartImage(item.id));
              } catch (error) {
                const reason =
                  error instanceof Error ? error.message : String(error);
                throw new Error(
                  `Could not read the design file for ${item.product}: ${reason}`,
                );
              }
              if (!file) {
                throw new Error(`No design file was found for ${item.product}`);
              }
              return { item, designId: "legacy", file };
            })(),
          ];
        }

        return designs.map(async (design) => {
          let file: File | undefined;
          try {
            const key = getCartImageKey(item.id, design.id);
            file = tempFiles[key] ?? (await getCartImage(item.id, design.id));
          } catch (error) {
            const reason =
              error instanceof Error ? error.message : String(error);
            throw new Error(
              `Could not read ${design.fileName} for ${item.product}: ${reason}`,
            );
          }
          if (!file) {
            throw new Error(`No design file was found for ${design.fileName}`);
          }
          return { item, designId: design.id, file };
        });
      }),
    );
    const loadedBytesByDesign: Record<string, number> = {};
    const totalBytes = uploads.reduce(
      (total, { file }) => total + file.size,
      0,
    );
    let loadedBytes = 0;

    await Promise.all(
      uploads.map(async ({ item, designId, file }) => {
        const safeItemId = item.id.replace(/[^a-zA-Z0-9_-]/g, "_");
        const safeDesignId = designId.replace(/[^a-zA-Z0-9_-]/g, "_");
        const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `${gid}/${safeItemId}-${safeDesignId}-${safeFileName || "upload"}`;
        const progressKey = `${item.id}:${designId}`;

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
                  itemLoadedBytes - (loadedBytesByDesign[progressKey] ?? 0);
                loadedBytesByDesign[progressKey] = itemLoadedBytes;
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
          throw new Error(`Axios upload failed for ${file.name}: ${reason}`);
        }

        filePaths[item.id] ??= {};
        filePaths[item.id][designId] = filePath;
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
