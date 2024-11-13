<template>
  <div class="story-guide mt-5">
    <h4 class="story-title">프로젝트 스토리 <span class="required">*</span></h4>

    <!-- 통합 TIP 섹션 -->
    <div class="tip-section p-3 bg-light rounded">
      <!-- TIP 1 -->
      <div class="tip-header d-flex align-items-center mb-2">
        <span class="badge bg-primary me-2">TIP 1</span>
        <p class="tip-title mb-0">스토리는 이렇게 작성해 보세요</p>
      </div>
      <ul class="tip-list pl-3">
        <li>이미지는 너비 740px 이상으로 등록해야 상세 페이지의 스토리에 여백이 생기지 않아요.</li>
        <li>이미지와 설명을 구성으로 스토리를 작성하면 네이버 포털 검색 결과에 상위 노출될 확률이 높아져요.</li>
        <li>이미지로만 구성된 스토리는 이미지 로딩 속도가 느려 서포터가 상세페이지를 벗어날 확률이 높아져요.</li>
        <li>스토리 작성이 어렵다면 <a href="#" class="service-link">스토리 제작 서비스</a>로 전문가와 맞춤형 스토리를 만들어 보세요.</li>
      </ul>

      <!-- TIP 2 -->
      <div class="tip-header d-flex align-items-center mb-2">
        <span class="badge bg-primary me-2">TIP 2</span>
        <p class="tip-title mb-0">서포터에게 꼭 알려 주세요</p>
      </div>
      <ul class="tip-list pl-3">
        <li>도서산간 배송비가 있다면 정확한 추가 금액과 지불 방법을 스토리에 작성해 주세요.</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectStoryGuide",
};
</script>

<style scoped>
.story-guide {
  font-family: Arial, sans-serif;
  color: #333;
  text-align: left;
}

.story-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

.required {
  color: red;
}

.tip-title {
  font-weight: bold;
  font-size: 16px;
}

.tip-list {
  list-style: none;
  padding-left: 0;
  font-size: 14px;
  color: #555;
  margin-bottom: 16px;
}

.tip-list li {
  margin-bottom: 8px;
}

.service-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.service-link:hover {
  text-decoration: underline;
}
</style>
