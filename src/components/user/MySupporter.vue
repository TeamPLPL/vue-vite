<template>
  <div class="container-fluid">
    <div class="row">
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="col-lg-9 p-4">
        <!-- 포인트 및 쿠폰 Section -->
        <div class="row mb-4">
          <h4 class="fw-bold text-start">서포터 홈</h4>
          <div class="col-md-4 mt-3" @click="setCoupon">
            <div class="border rounded p-3 bg-light">
              <div class="d-flex align-items-start" style="min-height: 57px; cursor: pointer">
                <img src="https://via.placeholder.com/24" alt="쿠폰 아이콘" class="me-2">
                <span>쿠폰</span>
                <span class="ms-auto fw-bold">{{ count }}장</span>
              </div>

              <!--              <hr>-->
              <!--              <div class="d-flex align-items-center" style="display: none">-->
              <!--                <img src="https://via.placeholder.com/24" alt="포인트 아이콘" class="me-2">-->
              <!--                <span>포인트</span>-->
              <!--                <span class="ms-auto fw-bold">0 P</span>-->
              <!--              </div>-->
            </div>
          </div>

          <!-- 펀딩+ 및 스토어 Section -->
          <div class="col-md-8 mt-3">
            <div class="row">
              <div class="col-6">
                <div class="border rounded p-3 text-start" style="min-height: 90px;">
                  <p class="mb-1 fw-bold" @click="participation" style="cursor: pointer">펀딩 참여내역+</p>
                  <p class="mb-0" style="display: none">0</p>
                </div>
              </div>
              <div class="col-6" style="display: none;">
                <div class="border rounded p-3 text-start">
                  <p class="mb-1 fw-bold">스토어</p>
                  <p class="mb-0">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 고객센터 Section -->
        <Info />

        <!-- 찜 리스트 및 팔로우 리스트 Section -->
        <WishsFollows />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import ProfileSidebar from "./userComponents/ProfileSidebar.vue";
import CustomerService from "./userComponents/CustomerService.vue";
import Info from "./userComponents/Info.vue";
import WishsFollows from "./userComponents/WishsFollows.vue";

import apiWrapper from '../../util/axios/axios';

export default {
  components: {
    WishsFollows,
    Info,
    ProfileSidebar,
    CustomerService
  },
  setup() {
    const router = useRouter();
    const count = ref(0); // 쿠폰 개수를 저장하는 변수

    const participation = async () => {
      router.push('/mywadiz/info/participation');
    };

    const setCoupon = async () => {
      router.push('/mywadiz/info/couponPage');
    }

    const fetchCouponCount = async () => {
      try {
        const response = await apiWrapper.getData('/api/coupons/count');
        count.value = response; // 쿠폰 개수를 count에 저장
        console.log(`유저의 쿠폰 개수: ${count.value}`);
      } catch (error) {
        console.error('쿠폰 개수 조회 실패:', error);
      }
    };

    onMounted(() => {
      fetchCouponCount();
    });

    return {
      count,
      participation,
      setCoupon
    };
  }
};
</script>

<style scoped>
.profile {
  width: 80px;
  /* 원하는 이미지 크기 */
  height: 80px;
  /* 원하는 이미지 크기 */
  border-radius: 50%;
  /* 원형으로 만듦 */
  object-fit: cover;
  /* 이미지가 원 안에 꽉 차게 조정 */
}
</style>