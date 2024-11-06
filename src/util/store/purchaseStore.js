import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePurchaseStore = defineStore('purchaseStore', () => {
    const totalPrice = ref(0);
    const donationAmount = ref(0);
    const quantity = ref(1);
    const orderId = ref(loadOrderIdFromLocalStorage()); // 초기값 설정 및 로컬 스토리지에서 로드

    function setPurchaseDetails(price, donation, qty) {
        totalPrice.value = price;
        donationAmount.value = donation;
        quantity.value = qty;
    }

    function incrementOrderId() {
        orderId.value += 1;
        localStorage.setItem('orderId', orderId.value.toString()); // 로컬 스토리지에 저장
    }

    function loadOrderIdFromLocalStorage() {
        const storedOrderId = localStorage.getItem('orderId');
        return storedOrderId ? parseInt(storedOrderId) : 1002; // 기본값 1000
    }

    return { totalPrice, donationAmount, quantity, orderId, setPurchaseDetails, incrementOrderId };
});