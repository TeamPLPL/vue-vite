<template>
    <div class="coupon-page">
        <h4 class="fw-bold text-start">쿠폰 관리</h4>
        <p v-if="isCouponIssuedToday" class="info-text text-danger mt-2">오늘 이미 쿠폰을 발행했습니다.</p>

        <div v-if="coupons.length > 0" class="coupon-list mt-4">
            <ul class="list-group">
                <li v-for="coupon in coupons" :key="coupon.id" class="list-group-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="coupon-info">
                            <strong>{{ coupon.couponName }}</strong> - {{ coupon.discountRate }}%
                            <br />
                            <small>(발행일: {{ formatDate(coupon.issueDate) }})</small>
                        </div>
                        <button @click="deleteCoupon(coupon.id)" class="btn btn-warning btn-sm">
                            삭제
                        </button>
                    </div>
                </li>
            </ul>
        </div>
        <p v-else class="no-coupons">사용 가능한 쿠폰이 없습니다.</p>

        <div class="d-flex justify-content-between">
            <button @click="goBack" class="issue-coupon-btn btn btn-secondary">
                돌아가기
            </button>
            <button @click="issueCoupon" :disabled="isCouponIssuedToday" class="issue-coupon-btn btn btn-primary">
                쿠폰 발행
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter for navigation
import apiWrapper from '../../util/axios/axios';

const coupons = ref([]);
const isCouponIssuedToday = ref(false);

const router = useRouter(); // Initialize the router

const fetchCoupons = async () => {
    try {
        const data = await apiWrapper.getData('/api/coupons/user');
        coupons.value = data;
        console.log(coupons.value);
        checkTodayCoupon();
    } catch (error) {
        console.error('쿠폰 조회 실패:', error);
    }
};

const goBack = () => {
    router.push('/mywadiz/supporter'); // Navigate to the specified path
};

const issueCoupon = async () => {
    try {
        const couponDTO = {
            couponName: `Daily Coupon ${new Date().toLocaleDateString()}`,
            discountRate: getRandomDiscountRate(),
            issueDate: new Date().toISOString(), // issueDate 추가
        };

        await apiWrapper.postData('/api/coupons/add', couponDTO);
        await fetchCoupons();
    } catch (error) {
        console.error('쿠폰 발행 실패:', error);
    }
};

const getRandomDiscountRate = () => {
    return Math.floor(Math.random() * (50 - 10 + 1)) + 10;
};

const deleteCoupon = async (couponId) => {
    try {
        await apiWrapper.deleteData(`/api/coupons/delete/${couponId}`);
        coupons.value = coupons.value.filter((coupon) => coupon.id !== couponId);
    } catch (error) {
        console.error('쿠폰 삭제 실패:', error);
    }
};

const checkTodayCoupon = () => {
    const today = new Date().toISOString().slice(0, 10);
    isCouponIssuedToday.value = coupons.value.some(
        (coupon) => coupon.issueDate.slice(0, 10) === today
    );
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

onMounted(() => {
    fetchCoupons();
});
</script>

<style scoped>
.coupon-page {
    max-width: 600px;
    margin: auto;
    padding: 20px;
}

.issue-coupon-btn {
    width: 100%;
}

.coupon-list {
    margin-top: 20px;
    max-height: 300px; /* Set fixed height for scrolling */
    overflow-y: auto; /* Enable vertical scrolling */
    border: 1px solid #ddd; /* Optional: Add a border for better visual separation */
    border-radius: 5px; /* Optional: Rounded corners for better appearance */
}

.list-group-item {
    padding: 1rem;
}

.coupon-info {
    text-align: left;
    flex-grow: 1;
    padding-right: 1rem;
}

.no-coupons {
    text-align: center;
    font-size: 1rem;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
</style>