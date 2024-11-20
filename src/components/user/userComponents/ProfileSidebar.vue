<template>
  <!-- Sidebar -->
  <div class="col-lg-3 border-end d-none d-lg-block">
    <div class="d-flex flex-column align-items-center p-3">
      <!-- Same-line Buttons for 서포터 and 메이커 -->
      <div class="d-flex mb-3">
        <button class="btn btn-outline-secondary me-2" @click="mySupporter">서포터</button>
        <button class="btn btn-outline-secondary" @click="myMaker">메이커</button>
      </div>

      <!-- Profile Section -->
      <img v-if="!fileId" src="https://static.wadiz.kr/assets/icon/profile-icon-5.png" class="rounded-circle mb-2" style="width: 100px;" alt="Profile Icon">
      <img else :src="profileImage" class="rounded-circle mb-2" style="width: 120px; height: 120px; object-fit: cover;" alt="Profile Icon">
      <span class="badge bg-primary mt-2" style="font-size: 1rem; padding: 10px;">아기광어 님</span>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import apiWrapper from "../../../util/axios/axios.js";

export default {
  setup() {
    const router = useRouter();
    const profileImage = ref(null); // 썸네일 URL
    const fileId = ref(null); // 파일 ID

    onMounted(() => {
      fetchInitialProfileImage(); // 컴포넌트 초기화 시 썸네일 데이터 가져오기
    });

    const fetchInitialProfileImage = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/profileimage`);
        const fileData = response; // 서버 응답이 바로 FileDTO 객체라고 가정
        console.log(response);
        profileImage.value = fileData.signedUrl; // 썸네일 URL 설정
        fileId.value = fileData.fileId; // fileId 저장
      } catch (error) {
        console.error("초기 썸네일 가져오기 실패:", error);
      }
    };

    const myMaker = async () => {
      router.push('/mywadiz/maker');
    };

    const mySupporter = async () => {
      router.push('/mywadiz/supporter');
    };

    return {
      myMaker,
      mySupporter,
      profileImage,
      fileId
    };
  }
};
</script>



<style scoped>

</style>