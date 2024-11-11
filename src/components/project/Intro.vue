<template>
  <div class="container-fluid">
    <div class="row">
      <ProjectSidebar/>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h2 class="fw-bold text-start">프로젝트 시작</h2>
        <p class="text-start">프로젝트가 성공할 수 있게 와디즈가 응원할게요.</p>
        <hr>

        <!-- 프로젝트 제목 -->
        <label for="project-title" class="fw-bold text-start d-block">프로젝트 제목</label>
        <input type="text" id="project-title" class="form-control w-50 mb-3" placeholder="프로젝트 제목을 입력하세요">

        <!-- 카테고리 -->
        <label for="project-category" class="fw-bold text-start d-block">카테고리 *</label>
        <p class="text-muted text-start">프로젝트와 가장 잘 어울리는 카테고리를 선택해 주세요.<br>프로젝트를 만들고 바꿀 수 있어요</p>

        <!-- Button to open modal instead of input field -->
        <button id="project-category" class="form-control w-50 text-start" onclick="openCategoryModal()">카테고리 선택</button>

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