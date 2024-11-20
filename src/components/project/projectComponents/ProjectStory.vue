<template>
  <div class="story-guide mt-5">
    <h4 class="story-title fw-bold">프로젝트 스토리 <span class="required">*</span></h4>

    <!-- 통합 TIP 섹션 -->
    <div class="tip-section p-3 bg-light rounded">
      <!-- TIP 1 -->
      <div class="tip-header d-flex align-items-center mb-2">
        <span class="badge bg-primary me-2">TIP 1</span>
        <p class="tip-title mb-0">스토리는 이렇게 작성해 보세요</p>
      </div>
      <ul class="tip-list pl-3">
        <li> 👋 안녕하세요. 스토리 작성을 시작한 메이커님을 환영해요!
          <ol style="list-style-type: decimal;">
            <li class="mt-1">아래는 스토리를 쉽게 작성할 수 있도록 안내를 드리는 문구예요. <br> 스토리를 어떻게 작성할지 고민이 된다면 참고해 보세요.</li>
            <li>와디즈는 메이커님 대신 스토리를 작성해 드리지 않아요. <br>  메이커님의 이야기를 생생하게 담고, 진심을 그대로 전하기 위함이니 이해해 주세요.</li>
          </ol>
        </li>
        <li>🔍 펀딩금을 모금하는 목적과, 제품이나 서비스를 준비하게 된 배경에 대해 설명해 주세요.</li>
        <li>❓이번에 선보이는 프로젝트는 어떤 이야기를 가지고 있나요?
          <ol style="list-style-type: decimal;">
              <li class="mt-1">리워드의 디테일 사진을 설명해 주세요.</li>
              <li>프로젝트 혹은 준비한 제품이나 서비스의 차별점을 알려 주세요.</li>
              <li>핵심적인 3가지 내용 위주로 담는 것을 추천해요.</li>
            </ol>
        </li>
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
