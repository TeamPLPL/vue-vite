<template>
  <div class="container-fluid">
    <div class="row">
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="col-lg-9 p-4">
        <!-- Project Section -->
        <div class="mb-4">
          <h4 class="fw-bold text-start">메이커 홈</h4>
          <div class="border mt-4 p-4 text-center rounded d-flex flex-column" style="border-radius: 15px; min-height: 300px;">
            <p class="fw-bold mb-1">새로운 도전을 시작해 보세요</p>
            <p class="text-muted">개인 후원부터 제품 · 콘텐츠 · 서비스 출시, 성장까지 와디즈가 함께할게요</p>
            <button class="btn btn-primary w-100 mt-auto" @click="createProject">프로젝트 만들기</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import apiWrapper from "../../util/axios/axios.js"
import ProfileSidebar from "./userComponents/ProfileSidebar.vue";
import CustomerService from "./userComponents/CustomerService.vue";
import {useRouter} from "vue-router";
import Info from "./userComponents/Info.vue";

export default {
  components : {
    Info,
    ProfileSidebar,
    CustomerService
  },
  setup() {
    const router = useRouter();

    const createProject = () => {
      // 프로젝트 생성 여부 확인
      if (confirm('프로젝트를 생성하시겠습니까?')) {
        const startProject = async () => {
          try {
            const response = await apiWrapper.getData('/api/studio/start');
            const projectId = response.projectId;

            alert(`프로젝트가 생성되었습니다! 프로젝트 ID: ${projectId}`);
            router.push(`/studio/${projectId}/project`);
          } catch (error) {
            console.error('프로젝트 시작 오류:', error);
            alert('프로젝트 생성 중 오류가 발생했습니다.');
          }
        };

        startProject();
      } else {
        console.log('프로젝트 생성 취소');
        alert('프로젝트 생성이 취소되었습니다.');
      }
    };

    return {
      createProject,
    }
  }
}
</script>



<style scoped>
.profile{
  width: 80px; /* 원하는 이미지 크기 */
  height: 80px; /* 원하는 이미지 크기 */
  border-radius: 50%; /* 원형으로 만듦 */
  object-fit: cover; /* 이미지가 원 안에 꽉 차게 조정 */
}
</style>