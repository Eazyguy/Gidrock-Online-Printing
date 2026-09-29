const DATABASE_NAME = "gidrock-cart-images"
const STORE_NAME = "images"
const DATABASE_VERSION = 1

let databasePromise: Promise<IDBDatabase> | undefined

const openDatabase = (): Promise<IDBDatabase> => {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("IndexedDB is unavailable"))
  }

  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME)
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    }).catch((error: unknown) => {
      databasePromise = undefined
      throw error
    })
  }

  return databasePromise
}

export const getCartImage = async (itemId: string) => {
  const database = await openDatabase()
  const transaction = database.transaction(STORE_NAME, "readonly")
  const request = transaction.objectStore(STORE_NAME).get(itemId)

  return new Promise<File | undefined>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as File | undefined)
    request.onerror = () => reject(request.error)
  })
}

const updateCartImages = async (
  operation: (store: IDBObjectStore) => IDBRequest
) => {
  const database = await openDatabase()
  const transaction = database.transaction(STORE_NAME, "readwrite")
  operation(transaction.objectStore(STORE_NAME))

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

export const saveCartImage = (itemId: string, file: File) =>
  updateCartImages((store) => store.put(file, itemId))

export const deleteCartImage = (itemId: string) =>
  updateCartImages((store) => store.delete(itemId))

export const clearCartImages = () =>
  updateCartImages((store) => store.clear())