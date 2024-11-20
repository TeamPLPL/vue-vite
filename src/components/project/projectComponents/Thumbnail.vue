<template>
  <!-- 대표 이미지 -->
  <div class="mt-5 mb-5 clearfix"> <!-- clearfix 추가 -->
    <h4 class="fw-bold text-start">대표 이미지 <span class="text-danger">*</span></h4>
    <p class="text-muted small text-start">와디즈 및 포털 검색 결과, SNS 타겟 광고 등에 노출할 대표 이미지를 등록해 주세요.</p>

    <!-- 가이드 안내 -->
    <div class="bg-light p-3 rounded-3">
      <div class="d-flex align-items-center text-primary fw-bold mb-2">
        <i class="bi bi-info-circle-fill me-2"></i> 대표 이미지 등록 가이드
      </div>
      <ul class="list-unstyled small text-muted ms-4 text-start" style="list-style-type: circle">
        <li>10MB 이하의 JPG, JPEG, PNG 파일</li>
        <li>해상도 1200x675 픽셀 이상</li>
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
  name: "Thumbnail",
  setup() {
    const route = useRoute(); // 현재 라우트 정보 가져오기
    const projectId = route.params.projectId; // 라우트 params에서 projectId 가져오기
    const thumbnail = ref(null); // 썸네일 URL
    const fileId = ref(null); // 파일 ID
    const fileInput = ref(null); // input 요소에 대한 ref

    const fetchInitialThumbnail = async () => {
      try {
        const response = await apiWrapper.getData(`/api/${projectId}/thumbnail`);
        const fileData = response; // 서버 응답이 바로 FileDTO 객체라고 가정
        thumbnail.value = fileData.signedUrl; // 썸네일 URL 설정
        fileId.value = fileData.fileId; // fileId 저장
      } catch (error) {
        console.error("초기 썸네일 가져오기 실패:", error);
      }
    };

    const onImageUpload = async (event) => {
      const file = event.target.files[0];

      // 중복 실행 방지
      if (!file) {
        console.warn("파일이 선택되지 않았습니다.");
        return;
      }

      if (!file || file.size > 10 * 1024 * 1024) {
        alert("이미지는 10MB 이하의 JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiWrapper.postFileData(`/api/${projectId}/thumbnail`, formData);
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
  border-radius: 8px; /* 둥근 모서리 */
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


