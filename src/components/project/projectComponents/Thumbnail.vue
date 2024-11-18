<template>
  <!-- 대표 이미지 -->
  <div class="mt-5 mb-5 clearfix"> <!-- clearfix 추가 -->
    <h5 class="fw-bold text-start">대표 이미지 <span class="text-danger">*</span></h5>
    <p class="text-muted text-start">와디즈 및 포털 검색 결과, SNS 타겟 광고 등에 노출할 대표 이미지를 등록해 주세요.</p>

    <!-- 가이드 안내 -->
    <div class="bg-light p-3 rounded-3">
      <div class="d-flex align-items-center text-primary fw-bold mb-2">
        <i class="bi bi-info-circle-fill me-2"></i> 대표 이미지 등록 가이드
      </div>
      <ul class="list-unstyled small text-muted ms-3 text-start">
        <li>10MB 이하의 JPG, JPEG, PNG 파일</li>
        <li>해상도 1200x675 픽셀 이상</li>
      </ul>
    </div>

    <!-- 이미지 업로드 -->
    <div class="mt-4">
      <input ref="fileInput" type="file" class="form-control w-50" @change="onImageUpload" accept="image/*"/>
    </div>

    <!-- 이미지 썸네일 -->
    <div v-if="thumbnail" class="thumbnail-container mt-3">
      <div class="thumbnail-wrapper">
        <img :src="thumbnail" alt="Uploaded Thumbnail" class="thumbnail-image"/>
        <button type="button" class="btn-close position-absolute top-0 end-0" @click="removeImage" aria-label="Close"></button>
      </div>
    </div>
  </div>
</template>

<script>
import apiWrapper from "../../../util/axios/axios.js";

export default {
  name: "Thumbnail",
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      thumbnail: null,
      projectId: this.$route.params.projectId, // 라우터에서 projectId 가져오기
    };
  },
  methods: {
    async onImageUpload(event) {
      const file = event.target.files[0];

      if (!file || file.size > 10 * 1024 * 1024) {
        alert("이미지는 10MB 이하의 JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiWrapper.postFileData(`/api/${this.projectId}/thumbnail`, formData);
        this.thumbnail = response.data; // 썸네일 URL 설정
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 문제가 발생했습니다.");
      }
    },
    removeImage() {
      this.thumbnail = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ""; // 파일 입력 초기화
      }
    },
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
  position: absolute; /* 위치 설정 */
  top: 0; /* 부모의 상단 */
  right: 0; /* 부모의 오른쪽 */
  transform: translate(-50%, 50%); /* 위치 조정 (필요 시 추가) */
}
</style>
