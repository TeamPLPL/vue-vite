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
      <input type="file" class="form-control w-50" @change="onImageUpload" accept="image/*"/>
    </div>

    <!-- 이미지 썸네일 -->
    <div v-if="thumbnail" class="thumbnail-container mt-3"> <!-- float-start 제거 -->
      <img :src="thumbnail" alt="Uploaded Thumbnail" class="img-thumbnail" style="width: 150px; height: auto;"/>
      <button type="button" class="btn-close position-absolute top-0 end-0" @click="removeImage" aria-label="Close"></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Thumbnail",
  data() {
    return {
      thumbnail: null, // 이미지 미리보기 URL
    };
  },
  methods: {
    onImageUpload(event) {
      const file = event.target.files[0];
      if (file && file.size <= 10 * 1024 * 1024) {
        // 10MB 이하 확인
        this.thumbnail = URL.createObjectURL(file);
      } else {
        alert("이미지는 10MB 이하의 JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
        event.target.value = ""; // 파일 입력 초기화
      }
    },
    removeImage() {
      this.thumbnail = null;
    },
  },
}
</script>

<style scoped>
.thumbnail-container {
  display: inline-block;
  text-align: left; /* 왼쪽 정렬 */
  margin-top: 10px; /* 제목과 간격 조정 */
}
</style>