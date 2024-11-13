// purchaseStore.js
import { defineStore } from 'pinia';

export const usePurchaseStore = defineStore('purchase', {
    state: () => ({
        selectedRewards: [], // 선택된 리워드
        totalPrice: 0, // 총 리워드 가격
        donationAmount: 0, // 추가 후원금
        deliveryFee: 0, // 배송비
        orderId: 1007, // 주문 ID 초기값
    }),
    actions: {
        setPurchaseDetails(rewards, totalPrice, donationAmount, deliveryFee) {
            this.selectedRewards = rewards;
            this.totalPrice = totalPrice;
            this.donationAmount = donationAmount;
            
            // 배송비는 가장 비싼 배송비를 가진 상품 하나의 배송비로 설정
            this.deliveryFee = rewards.reduce((maxFee, reward) => {
                return Math.max(maxFee, reward.deliveryFee || 0);
            }, 0);
        },
        setOrderId(orderId) {
            this.orderId = orderId;
        },
        incrementOrderId() {
            if (this.orderId !== null) {
                this.orderId += 1;
            } else {
                console.error("Order ID is not set");
            }
        },
    }
});


// import { defineStore } from 'pinia';
// import { ref, watch } from 'vue';

// export const usePurchaseStore = defineStore('purchaseStore', () => {
//     const totalPrice = ref(0);
//     const donationAmount = ref(0);
//     const quantity = ref(1);
//     const orderId = ref(loadOrderIdFromLocalStorage()); // 초기값 설정 및 로컬 스토리지에서 로드

//     // 상태 변화 감지용 watch 설정
//     watch(orderId, (newValue) => {
//         console.log("orderId changed:", newValue); // orderId가 변경될 때마다 출력
//     });

//     function setPurchaseDetails(price, donation, qty) {
//         totalPrice.value = price;
//         donationAmount.value = donation;
//         quantity.value = qty;
//     }

//     function incrementOrderId() {
//         orderId.value += 1;
//         console.log('New Order ID:', orderId.value); // 디버깅용
//         localStorage.setItem('orderId', orderId.value.toString()); // 로컬 스토리지 업데이트
//     }

//     function loadOrderIdFromLocalStorage() {
//         const storedOrderId = localStorage.getItem('orderId');
//         console.log("Loaded Order ID from localStorage:", storedOrderId);
//         return storedOrderId ? parseInt(storedOrderId) : 1000; // 기본값 1010
//     }

//     return { totalPrice, donationAmount, quantity, orderId, setPurchaseDetails, incrementOrderId };
// });
