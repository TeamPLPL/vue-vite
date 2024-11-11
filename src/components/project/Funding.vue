<template>
  <div class="container-fluid">
    <div class="row">
      <ProjectSidebar/>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h2 class="fw-bold text-start">프로젝트 관리</h2>
        <p class="text-start">프로젝트를 공개하는 데 필요한 내용을 작성해 주세요.</p>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">프로젝트 시작</h6>
          <button class="btn btn-primary ms-auto">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">프로젝트 일정</h6>
          <button class="btn btn-primary ms-auto">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">프로젝트 정보</h6>
          <button class="btn btn-primary ms-auto">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">리워드 설계</h6>
          <button class="btn btn-primary ms-auto">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">리워드 정책</h6>
          <button class="btn btn-primary ms-auto">작성하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";

export default defineComponent({
  components: {ProjectSidebar}
})
</script>


<style scoped>

</style>