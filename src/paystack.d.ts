export {};

declare global {
	interface Window {
		PaystackPop?: new () => {
			resumeTransaction(
				accessCode: string,
				callbacks?: {
					onSuccess?: (transaction: { reference: string }) => void;
					onCancel?: () => void;
					onError?: (error: { message: string }) => void;
				},
			): unknown;
		};
	}
}
