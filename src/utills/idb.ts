export const getfileFromIDB = async (fileId: string): Promise<File | null> => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open("gidrock-checkout", 1);
		const tx = request.result.transaction("files", "readonly");
		const store = tx.objectStore("files");
		const getRequest = store.get(fileId);

		getRequest.onsuccess = () => {
			if (!getRequest.result) {
				resolve(null);
				return;
			}

			const blob = getRequest.result.file;
			const file = new File([blob], getRequest.result.name, {
				type: blob.type,
			});
			resolve(file);
		};

		getRequest.onerror = () => {
			reject(getRequest.error);
		};
	});
	return null;
};
