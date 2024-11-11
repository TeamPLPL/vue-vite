<!-- Sidebar.vue -->
<template>
  <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
    <div class="p-3">
      <div class="border rounded p-3 mb-3">
        <h6 class="fw-bold">프로젝트 번호</h6>
        <p class="text-primary mb-0">319893</p>
      </div>
      <hr>
      <div class="d-flex align-items-center ps-2">
        <i class="bi bi-card-checklist fs-4 me-2"></i>
        <div class="py-2 fw-bold">프로젝트 관리</div>
      </div>
      <ul class="list-unstyled bg-light ps-3">
        <li class="py-2 ps-4  text-start">프로젝트 시작</li>
        <li class="py-2 ps-4 text-start">프로젝트 일정</li>
        <li class="py-2 ps-4 text-start">프로젝트 정보</li>
        <li class="py-2 ps-4 text-start">리워드 설계</li>
        <li class="py-2 ps-4 text-start">리워드 정책</li>
      </ul>
    </div>
    <button class="btn btn-primary w-100 mt-auto mb-3">저장하기</button>
    <button class="btn custom-btn w-100 mt-auto">나가기</button>
  </div>
</template>

<script>
export default {
  name: 'ProjectSidebar'
}
</script>

<style scoped>
@media (min-width: 992px) {
  .sidebar-fixed-width {
    width: 227px;
  }
}
.custom-btn {
  background-color: #cfcfcf;
  transition: background-color 0.3s ease;
}
.custom-btn:hover {
  background-color: #b3b3b3;
}
</style>
