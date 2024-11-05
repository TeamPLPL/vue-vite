// src/stores/purchaseStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePurchaseStore = defineStore('purchaseStore', () => {
    const totalPrice = ref(0);
    const donationAmount = ref(0);
    const quantity = ref(1); // 수량 추가

    function setPurchaseDetails(price, donation, qty) {
        totalPrice.value = price;
        donationAmount.value = donation;
        quantity.value = qty;
    }

    return { totalPrice, donationAmount, quantity, setPurchaseDetails };
});
