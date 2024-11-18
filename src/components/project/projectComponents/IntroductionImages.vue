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

    <!-- 이미지 업로드 섹션 -->
    <div class="d-flex flex-wrap gap-2">
      <div
          v-for="(image, index) in images"
          :key="image.url"
          class="position-relative"
          style="width: 80px; height: 80px;"
      >
        <img
            :src="image.url"
            alt="이미지 미리보기"
            class="img-fluid w-100 h-100 object-fit-cover"
        />
        <!-- 삭제 버튼 -->
        <button
            class="btn btn-danger btn-sm position-absolute top-0 end-0"
            @click="removeImage(index)"
            style="z-index: 1;"
        >
          삭제
        </button>
      </div>

      <!-- 업로드 버튼 -->
      <div
          class="d-flex flex-column align-items-center justify-content-center position-relative border border-secondary border-dashed rounded"
          style="width: 80px; height: 80px; cursor: pointer;"
      >
        <input
            type="file"
            @change="uploadImage"
            class="file-input position-absolute w-100 h-100 opacity-0"
        />
        <i class="bi bi-camera fs-3 text-muted"></i>
        <p class="small text-muted">{{ images.length }}/10</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import apiWrapper from "../../../util/axios/axios.js";

export default {
  name: "IntroductionImages",
  setup() {
    const route = useRoute();
    const projectId = route.params.projectId;

    const images = ref([]);

    const uploadImage = async (event) => {
      const file = event.target.files[0];
      if (!file || file.size > 10 * 1024 * 1024) {
        alert("이미지는 10MB 이하의 JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        // 이미지 업로드 API 호출
        const response = await apiWrapper.postFileData(
            `/api/${projectId}/introductionimages`,
            formData
        );

        console.log("업로드된 이미지 URL:", response.data); // 디버깅용
        images.value.push({ url: response.data }); // 반환된 URL을 배열에 추가

        console.log("Images 배열:", images.value);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 문제가 발생했습니다.");
      }
    };

    const removeImage = (index) => {
      // 해당 이미지를 배열에서 제거
      images.value.splice(index, 1);
      console.log("Images 배열:", images.value);
    };

    return {
      images,
      uploadImage,
      removeImage,
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
