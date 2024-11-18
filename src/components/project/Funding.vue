<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
        <!-- ProjectSidebar에 projectId 바인딩 -->
        <ProjectSidebar :projectId="projectId"/>
      </div>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h2 class="fw-bold text-start">프로젝트 관리</h2>
        <p class="text-start">프로젝트를 공개하는 데 필요한 내용을 작성해 주세요.</p>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">프로젝트 시작</h6>
          <button class="btn btn-primary ms-auto" @click="intro">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">프로젝트 일정</h6>
          <button class="btn btn-primary ms-auto" @click="schedule">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">프로젝트 정보</h6>
          <button class="btn btn-primary ms-auto" @click="info">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">리워드 설계</h6>
          <button class="btn btn-primary ms-auto" @click="reward">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <h6 class="mb-0">리워드 정책</h6>
          <button class="btn btn-primary ms-auto" @click="policy">작성하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import {useRouter} from "vue-router";

export default defineComponent({
  components: {ProjectSidebar},
  props: {
    projectId: { // 'id'가 아닌 'projectId'로 설정되어 있음
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const intro = () => {
      router.push(`/studio/${props.projectId}/project/intro`);
    };

    const schedule = () => {
      router.push(`/studio/${props.projectId}/project/schedule`);
    };

    const info = () => {
      router.push(`/studio/${props.projectId}/project/info`);
    };

    const reward = () => {
      router.push(`/studio/${props.projectId}/project/reward`);
    };

    const policy = () => {
      router.push(`/studio/${props.projectId}/project/policy`);
    };

    return {
      intro,
      schedule,
      info,
      reward,
      policy
    };
  },
});
</script>

