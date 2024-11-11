<template>
  <div class="container-fluid">
    <div class="row">
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="col-lg-9 p-4">
        <!-- 포인트 및 쿠폰 Section -->
        <div class="row mb-4">
          <h4 class="fw-bold text-start">서포터 홈</h4>
          <div class="col-md-4">
            <div class="border rounded p-3 bg-light">
              <div class="d-flex align-items-center mb-3">
                <img src="https://via.placeholder.com/24" alt="포인트 아이콘" class="me-2">
                <span>포인트</span>
                <span class="ms-auto fw-bold">0 P</span>
              </div>
              <hr>
              <div class="d-flex align-items-center">
                <img src="https://via.placeholder.com/24" alt="쿠폰 아이콘" class="me-2">
                <span>쿠폰</span>
                <span class="ms-auto fw-bold">17장</span>
              </div>
            </div>
          </div>

          <!-- 펀딩+ 및 스토어 Section -->
          <div class="col-md-8">
            <div class="row">
              <div class="col-6">
                <div class="border rounded p-3 text-start">
                  <p class="mb-1 fw-bold" @click="participation" style="cursor: pointer">펀딩+</p>
                  <p class="mb-0">0</p>
                </div>
              </div>
              <div class="col-6">
                <div class="border rounded p-3 text-start">
                  <p class="mb-1 fw-bold">스토어</p>
                  <p class="mb-0">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 고객센터 Section -->
        <CustomerService/>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import ProfileSidebar from "./userComponents/ProfileSidebar.vue";
import CustomerService from "./userComponents/CustomerService.vue";

export default {
  components: {
    ProfileSidebar,
    CustomerService
  },
  setup() {
    const router = useRouter();

    const participation = async () => {
      router.push('/participation');
    };

    return {
      participation,
    };
  }
};
</script>

<style scoped>
.profile{
  width: 80px; /* 원하는 이미지 크기 */
  height: 80px; /* 원하는 이미지 크기 */
  border-radius: 50%; /* 원형으로 만듦 */
  object-fit: cover; /* 이미지가 원 안에 꽉 차게 조정 */
}
</style>