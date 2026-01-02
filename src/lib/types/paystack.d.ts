declare module '@paystack/inline-js' {
	interface PaystackCallback {
		onSuccess?: (transaction: { reference: string }) => void;
		onCancel?: () => void;
		onError?: (error: Error) => void;
	}

	class PaystackPop {
		resumeTransaction(accessCode: string, callbacks: PaystackCallback): void;
	}

	export default PaystackPop;
}
