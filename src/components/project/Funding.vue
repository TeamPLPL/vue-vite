<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
        <!-- ProjectSidebar에 projectId 바인딩 -->
        <ProjectSidebar :projectId="projectId"/>

        <!-- 버튼 자리  -->
        <button
            class="btn btn-danger mt-2 w-100"
            @click="exit"
            :disabled="!completionStatus.isComplete">
          제출 하기
        </button>
      </div>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h2 class="fw-bold text-start">프로젝트 관리</h2>
        <p class="text-start">프로젝트를 공개하는 데 필요한 내용을 작성해 주세요.</p>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <div class="d-flex align-items-center">
            <h6 class="mb-0 me-3">프로젝트 시작</h6>
            <span class="badge" :class="completionStatus.isIntroCompleted ? 'text-bg-primary' : 'text-bg-secondary'">
              {{ completionStatus.isIntroCompleted ? "작성 완료" : "작성 중,,," }}
            </span>
          </div>
          <button class="btn" :class="completionStatus.isIntroCompleted ? 'btn-outline-primary' : 'btn-primary'" @click="intro">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <div class="d-flex align-items-center">
            <h6 class="mb-0 me-3">프로젝트 일정</h6>
            <span class="badge" :class="completionStatus.isScheduleComplete ? 'text-bg-primary' : 'text-bg-secondary'">
              {{ completionStatus.isScheduleComplete ? "작성 완료" : "작성 중,,," }}
            </span>
          </div>
          <button class="btn" :class="completionStatus.isScheduleComplete ? 'btn-outline-primary' : 'btn-primary'" @click="schedule">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <div class="d-flex align-items-center">
            <h6 class="mb-0 me-3">프로젝트 정보</h6>
            <span class="badge" :class="completionStatus.isInfoComplete ? 'text-bg-primary' : 'text-bg-secondary'">
              {{ completionStatus.isInfoComplete ? "작성 완료" : "작성 중,,," }}
            </span>
          </div>
          <button class="btn" :class="completionStatus.isInfoComplete ? 'btn-outline-primary' : 'btn-primary'" @click="info">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <div class="d-flex align-items-center">
            <h6 class="mb-0 me-3">리워드 설계</h6>
            <span class="badge" :class="completionStatus.isRewardComplete ? 'text-bg-primary' : 'text-bg-secondary'">
              {{ completionStatus.isRewardComplete ? "작성 완료" : "작성 중,,," }}
            </span>
          </div>
          <button class="btn" :class="completionStatus.isRewardComplete ? 'btn-outline-primary' : 'btn-primary'" @click="reward">작성하기</button>
        </div>

        <div class="border rounded p-3 mb-3 d-flex align-items-center justify-content-between col-8">
          <div class="d-flex align-items-center">
            <h6 class="mb-0 me-3">리워드 정책</h6>
            <span class="badge" :class="completionStatus.isRewardInfoComplete ? 'text-bg-primary' : 'text-bg-secondary'">
              {{ completionStatus.isRewardInfoComplete ? "작성 완료" : "작성 중,,," }}
            </span>
          </div>
          <button class="btn" :class="completionStatus.isRewardInfoComplete ? 'btn-outline-primary' : 'btn-primary'" @click="policy">작성하기</button>
        </div>


      </div>
    </div>
  </div>
</template>


<script>
import {defineComponent, ref, onMounted, nextTick} from "vue";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import {useRouter} from "vue-router";
import apiWrapper from "../../util/axios/axios.js";

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
    const completionStatus = ref({
      isIntroCompleted: false,
      isScheduleComplete: false,
      isInfoComplete: false,
      isRewardComplete: false,
      isRewardInfoComplete: false,
      isComplete: false,
    });

    const isLoading = ref(true);

    // API 호출하여 데이터 가져오기
    const fetchCompletionStatus = async () => {
      try {
        const data = await apiWrapper.getData(`/api/${props.projectId}/iscomplete`);
        completionStatus.value = {...completionStatus.value, ...data};
        await nextTick(); // Vue의 반응형 데이터 업데이트 후 실행
      } catch (error) {
        console.error("Error fetching completion status:", error);
      } finally {
        isLoading.value = false; // 로딩 상태 종료
      }
    };

    // 페이지 로드 시 데이터 가져오기
    onMounted(fetchCompletionStatus);

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
      completionStatus,
      isLoading,
      intro,
      schedule,
      info,
      reward,
      policy,
    };
  },
});
</script>

<style scoped>

</style>
