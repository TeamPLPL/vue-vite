<!-- Sidebar.vue -->
<template>
    <div class="p-3">
      <div class="border rounded p-3 mb-3">
        <h6 class="fw-bold">프로젝트 번호</h6>
        <!-- props에 projectId값 받아옴  -->
        <p class="text-primary mb-0">{{ projectId }}</p>
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
</template>

<script>
export default {
  name: 'ProjectSidebar',
  props: {
    projectId: {
      type: String,
      required: true
    }
  }
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
