import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const usePurchaseStore = defineStore('purchaseStore', () => {
    const totalPrice = ref(0);
    const donationAmount = ref(0);
    const quantity = ref(1);
    const orderId = ref(loadOrderIdFromLocalStorage()); // 초기값 설정 및 로컬 스토리지에서 로드

    // 상태 변화 감지용 watch 설정
    watch(orderId, (newValue) => {
        console.log("orderId changed:", newValue); // orderId가 변경될 때마다 출력
    });

    function setPurchaseDetails(price, donation, qty) {
        totalPrice.value = price;
        donationAmount.value = donation;
        quantity.value = qty;
    }

    function incrementOrderId() {
        orderId.value += 1;
        console.log('New Order ID:', orderId.value); // 디버깅용
        localStorage.setItem('orderId', orderId.value.toString()); // 로컬 스토리지 업데이트
    }

    function loadOrderIdFromLocalStorage() {
        const storedOrderId = localStorage.getItem('orderId');
        console.log("Loaded Order ID from localStorage:", storedOrderId);
        return storedOrderId ? parseInt(storedOrderId) : 1000; // 기본값 1010
    }

    return { totalPrice, donationAmount, quantity, orderId, setPurchaseDetails, incrementOrderId };
});
