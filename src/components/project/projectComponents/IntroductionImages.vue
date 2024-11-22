<template>
  <div class="introduction-images mt-5">
    <h4 class="fw-bold text-start">소개 사진 등록 <span class="text-danger">*</span></h4>
    <p class="text-muted small text-start">프로젝트 상세페이지 최상단에 노출할 사진을 등록해 주세요.</p>

    <!-- 가이드 박스 -->
    <div class="bg-light p-3 rounded-3 mb-4">
      <div class="d-flex align-items-center text-primary fw-bold mb-2">
        <i class="bi bi-info-circle-fill me-2"></i> 소개 사진 등록 가이드
      </div>
      <ul class="list-unstyled small text-muted ms-3 text-start">
        <li>이미지 용량 제한</li>
        <ul class="mt-2" style="list-style-type: circle">
          <li>GIF: 2MB 이하, 해상도 760x480 픽셀 이상 ~ 1440x864 픽셀 이하</li>
          <li>JPG, JPEG, PNG: 10MB 이하, 해상도 760x480 픽셀 이상</li>
        </ul>
        <li class="mt-2">긴 이미지로 올리는 것을 추천드립니다.</li>
      </ul>
    </div>


    <!-- 이미지 업로드 -->
    <div class="mt-4">
      <input ref="fileInput" type="file" class="form-control w-50" @change="onImageUpload" accept="image/*" :disabled="thumbnail"/>
    </div>

    <!-- 이미지 썸네일 -->
    <div v-if="thumbnail" class="thumbnail-container mt-3 d-flex align-items-start">
      <div class="thumbnail-wrapper position-relative">
        <img :src="thumbnail" alt="Uploaded Thumbnail" class="thumbnail-image img-thumbnail float-start"/>
        <button
            type="button"
            class="btn-close position-absolute"
            @click="removeImage"
            aria-label="Close">
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router"; // useRoute 훅 가져오기
import apiWrapper from "../../../util/axios/axios.js";

export default {
  name: "IntroductionImages",
  setup() {
    const route = useRoute(); // 현재 라우트 정보 가져오기
    const projectId = route.params.projectId; // 라우트 params에서 projectId 가져오기
    const thumbnail = ref(null); // 썸네일 URL
    const fileId = ref(null); // 파일 ID
    const fileInput = ref(null); // input 요소에 대한 ref

    const fetchInitialThumbnail = async () => {
      try {
        const response = await apiWrapper.getData(`/api/${projectId}/detailiamge`);
        console.log(response);
        const fileData = response; // 서버 응답이 바로 FileDTO 객체라고 가정
        thumbnail.value = fileData.signedUrl; // 썸네일 URL 설정
        fileId.value = fileData.fileId; // fileId 저장
      } catch (error) {
        console.error("초기 디테일 이미지 가져오기 실패:", error);
      }
    };

    const onImageUpload = async (event) => {
      const file = event.target.files[0];

      if (!file || file.size > 10 * 1024 * 1024) {
        alert("이미지는 10MB 이하의 JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiWrapper.postFileData(`/api/${projectId}/detailiamge`, formData);
        console.log(response);
        const fileData = response.data; // FileDTO 데이터를 받음
        fileId.value = fileData.fileId; // fileId 저장
        thumbnail.value = fileData.signedUrl; // signedUrl로 썸네일 URL 설정
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 문제가 발생했습니다.");
      }
    };

    const removeImage = async () => {
      if (!fileId.value) {
        alert("삭제할 이미지가 없습니다.");
        return;
      }

      try {
        await apiWrapper.getData(`/api/${fileId.value}/deleteimage`);
        alert("이미지가 삭제되었습니다.");
        thumbnail.value = null; // 화면에서 썸네일 제거
        fileId.value = null; // fileId 초기화
        if (fileInput.value) {
          fileInput.value.value = ""; // 파일 입력 초기화
        }
      } catch (error) {
        console.error("이미지 삭제 실패:", error);
        alert("이미지 삭제 중 문제가 발생했습니다.");
      }
    };

    onMounted(() => {
      fetchInitialThumbnail(); // 컴포넌트 초기화 시 썸네일 데이터 가져오기
    });

    return {
      thumbnail,
      fileInput,
      onImageUpload,
      removeImage,
    };
  },
};
</script>

<style scoped>
.thumbnail-container {
  display: inline-block;
  position: relative;
  text-align: left;
  margin-top: 10px;
}

.thumbnail-wrapper {
  position: relative;
  width: 150px; /* 정사각형 크기 */
  height: 150px; /* 정사각형 크기 */
  overflow: hidden;
  border-radius: 8px; /* 둥근 모서리 (선택 사항) */
  background-color: #f8f9fa; /* 배경색 (이미지 없을 때 표시용) */
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 정사각형으로 맞춤 */
  display: block;
}

.btn-close {
  position: absolute;
  top: 8px; /* 상단 간격 */
  right: 8px; /* 오른쪽 간격 */
  width: 24px; /* 버튼 크기 */
  height: 24px;
  padding: 0;
  color: #6c757d; /* 아이콘 색상 */
  cursor: pointer;
}
</style>
