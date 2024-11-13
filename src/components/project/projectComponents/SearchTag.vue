<template>
  <div class="mt-5">
    <h4 class="fw-bold text-start">검색용 태그(#) <span class="text-danger">*</span></h4>
    <p class="text-muted text-start">프로젝트가 더 잘 검색될 수 있도록 연관성이 높은 태그를 입력해 주세요.<br>예시) 캠핑의자 → 캠핑</p>

    <!-- 태그 입력 필드 -->
    <input type="text" class="form-control mt-3" placeholder="엔터를 누르면 최대 10개까지 태그를 입력할 수 있어요" />
    <p class="text-muted small mt-2 text-start">0/10개의 태그</p>
  </div>
</template>

<script>
export default {
  name: "SearchTag"
}
</script>

<style scoped>

</style>