import { defineStore } from 'pinia';

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        isPaymentSuccessful: false,
    }),
    actions: {
        setPaymentSuccess(success) {
        this.isPaymentSuccessful = success;
        },
        resetPaymentStatus() {
        this.isPaymentSuccessful = false;
        }
    }
});
