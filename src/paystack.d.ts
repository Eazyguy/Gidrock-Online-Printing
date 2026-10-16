declare module "@paystack/inline-js" {
	export interface PaystackTransactionCallbacks {
		onSuccess?: (transaction: { reference: string }) => void;
		onCancel?: () => void;
		onError?: (error: { message: string }) => void;
	}

	export default class PayStackPop {
		constructor();
		resumeTransaction(
			accessCode: string,
			callbacks?: PaystackTransactionCallbacks,
		): unknown;
	}
}
