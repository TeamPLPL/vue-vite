<template>
  <div class="introduction-images">
    <h4 class="fw-bold text-start">소개 사진 등록</h4>
    <p class="description text-start">프로젝트 상세페이지 최상단에 노출할 사진을 등록해 주세요.</p>

    <!-- 가이드 박스 -->
    <div class="guide-box">
      <div class="guide-title">
        <i class="icon-info"></i> 소개 사진 등록 가이드
      </div>
      <ul class="guide-list">
        <li>이미지 용량 제한</li>
        <ul>
          <li>GIF: 2MB 이하, 해상도 760x480 픽셀 이상 ~ 1440x864 픽셀 이하</li>
          <li>JPG, JPEG, PNG: 10MB 이하, 해상도 760x480 픽셀 이상</li>
        </ul>
        <li>최대 10장까지 등록 가능</li>
        <li>사진을 선택하면 이미지를 자르거나 회전할 수 있어요. (GIF 편집 불가)</li>
        <li>사진을 길게 누르고 이동하면 사진 순서를 변경할 수 있어요.</li>
      </ul>
    </div>

    <!-- 이미지 업로드 리스트 -->
    <div class="image-upload-list">
      <div
          v-for="(image, index) in images"
          :key="index"
          class="image-item"
      >
        <img :src="image.url" alt="이미지 미리보기" />
      </div>
      <div class="upload-btn" v-if="images.length < 10">
        <input type="file" @change="uploadImage" class="file-input" />
        <i class="icon-camera"></i>
        <p>{{ images.length }}/10</p>
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
.introduction-images {
  text-align: left;
  font-family: Arial, sans-serif;
}

.description {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.guide-box {
  background-color: #e8f8f8;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.guide-title {
  font-weight: bold;
  color: #00848c;
  display: flex;
  align-items: center;
}

.icon-info {
  background-color: #00848c;
  color: white;
  border-radius: 50%;
  padding: 4px;
  margin-right: 8px;
}

.guide-list {
  font-size: 14px;
  color: #333;
  list-style: none;
  padding-left: 0;
}

.image-upload-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.image-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #f4f4f4;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.icon-camera {
  font-size: 24px;
  color: #aaa;
}

.upload-btn p {
  font-size: 12px;
  color: #333;
  margin-top: 4px;
}
</style>
