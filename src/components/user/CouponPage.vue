<template>
    <div class="coupon-page">
        <h1>쿠폰 관리</h1>

        <button @click="issueCoupon" :disabled="isCouponIssuedToday" class="issue-coupon-btn">
            쿠폰 발행
        </button>

        <p v-if="isCouponIssuedToday" class="info-text">오늘 이미 쿠폰을 발행했습니다.</p>

        <ul v-if="coupons.length > 0" class="coupon-list">
            <li v-for="coupon in coupons" :key="coupon.id" class="coupon-item">
                <div>
                    <strong>{{ coupon.couponName }}</strong> - {{ coupon.discountRate }}%
                    <small>(발행일: {{ formatDate(coupon.issueDate) }})</small>
                </div>
                <button @click="deleteCoupon(coupon.id)" class="delete-btn">삭제</button>
            </li>
        </ul>

        <p v-else class="no-coupons">사용 가능한 쿠폰이 없습니다.</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiWrapper from '../../util/axios/axios';

const coupons = ref([]);
const isCouponIssuedToday = ref(false);

const fetchCoupons = async () => {
    try {
        const data = await apiWrapper.getData('/api/coupons/user');
        coupons.value = data;
        checkTodayCoupon();
    } catch (error) {
        console.error('쿠폰 조회 실패:', error);
    }
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
/* 동일 스타일 유지 */
</style>