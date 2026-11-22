const DATABASE_NAME = "gidrock-cart-images";
const STORE_NAME = "images";
const DATABASE_VERSION = 1;
const DESIGN_KEY_SEPARATOR = "::";

let databasePromise: Promise<IDBDatabase> | undefined;

const openDatabase = (): Promise<IDBDatabase> => {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is unavailable"));
  }

  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
};

export const getCartImageKey = (itemId: string, designId?: string) =>
  designId ? `${itemId}${DESIGN_KEY_SEPARATOR}${designId}` : itemId;

export const getCartImage = async (itemId: string, designId?: string) => {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readonly");
  const request = transaction
    .objectStore(STORE_NAME)
    .get(getCartImageKey(itemId, designId));

  return new Promise<File | undefined>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as File | undefined);
    request.onerror = () => reject(request.error);
  });
};

const updateCartImages = async (
  operation: (store: IDBObjectStore) => IDBRequest,
) => {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  operation(transaction.objectStore(STORE_NAME));

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
};

export const saveCartImage = (itemId: string, file: File, designId?: string) =>
  updateCartImages((store) =>
    store.put(file, getCartImageKey(itemId, designId)),
  );

export const deleteCartImage = (itemId: string) =>
  openDatabase().then(
    (database) =>
      new Promise<void>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const keysRequest = store.getAllKeys();

        keysRequest.onsuccess = () => {
          const prefix = `${itemId}${DESIGN_KEY_SEPARATOR}`;
          keysRequest.result
            .filter(
              (key): key is string =>
                typeof key === "string" &&
                (key === itemId || key.startsWith(prefix)),
            )
            .forEach((key) => store.delete(key));
        };
        keysRequest.onerror = () => reject(keysRequest.error);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      }),
  );

export const clearCartImages = () => updateCartImages((store) => store.clear());
