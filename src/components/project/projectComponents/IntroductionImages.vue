<template>
  <div class="introduction-images mt-5">
    <h4 class="fw-bold text-start">소개 사진 등록</h4>
    <p class="text-muted small text-start">프로젝트 상세페이지 최상단에 노출할 사진을 등록해 주세요.</p>

    <!-- 가이드 박스 -->
    <div class="bg-light p-3 rounded-3 mb-4">
      <div class="d-flex align-items-center text-primary fw-bold mb-2">
        <i class="bi bi-info-circle-fill me-2"></i> 소개 사진 등록 가이드
      </div>
      <ul class="list-unstyled small text-muted ms-3 text-start">
        <li>이미지 용량 제한</li>
        <ul class="ms-4">
          <li>GIF: 2MB 이하, 해상도 760x480 픽셀 이상 ~ 1440x864 픽셀 이하</li>
          <li>JPG, JPEG, PNG: 10MB 이하, 해상도 760x480 픽셀 이상</li>
        </ul>
        <li>최대 10장까지 등록 가능</li>
      </ul>
    </div>

    <!-- 이미지 업로드 리스트 -->
    <div class="d-flex flex-wrap gap-2">
      <div
          v-for="(image, index) in images"
          :key="index"
          class="position-relative rounded overflow-hidden"
          style="width: 80px; height: 80px;"
      >
        <img :src="image.url" alt="이미지 미리보기" class="img-fluid w-100 h-100 object-fit-cover" />
      </div>

      <!-- 업로드 버튼 -->
      <div v-if="images.length < 10" class="d-flex flex-column align-items-center justify-content-center position-relative border border-secondary border-dashed rounded" style="width: 80px; height: 80px; cursor: pointer;">
        <input type="file" @change="uploadImage" class="file-input position-absolute w-100 h-100 opacity-0" />
        <i class="bi bi-camera fs-3 text-muted"></i>
        <p class="small text-muted">{{ images.length }}/10</p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";

export default {
  setup() {
    const images = reactive([]);

    const uploadImage = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        // 백엔드 API 호출하여 AWS S3에 이미지 업로드
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // 업로드 성공 시 DB에서 이미지 URL 불러오기
        const imageUrl = response.data.url; // 서버에서 반환된 이미지 URL
        images.push({ url: imageUrl });
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    };

    return {
      images,
      uploadImage,
    };
  },
};
</script>

<style scoped>
.file-input {
  cursor: pointer;
}

.object-fit-cover {
  object-fit: cover;
}
</style>
