<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
      <!-- ProjectSidebar에 projectId 바인딩 -->
      <ProjectSidebar :projectId="projectId" />
        <button class="btn btn-primary w-100" @click="saveProject">저장 하기</button>
        <button class="btn btn-secondary mt-2 w-100" @click="exit">나가기</button>
      </div>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h2 class="fw-bold text-start">프로젝트 일정</h2>
        <p class="text-start">프로젝트 일정을 설정할 수 있어요.</p>
        <hr>
        <!-- 날짜 선택 필드 -->
        <div class="d-flex align-items-center gap-5 mb-3">
          <div>
            <label for="start-date" class="form-label fw-bold">프로젝트 시작 일자</label>
            <input type="date" id="start-date" v-model="startDate" class="form-control" />
          </div>

          <div>
            <label for="end-date" class="form-label fw-bold">프로젝트 종료 일자</label>
            <input type="date" id="end-date" v-model="endDate" class="form-control" />
          </div>
        </div>

        <!-- 결과 텍스트 -->
        <p class="text-start fw-bold">
          프로젝트는 <span class="badge bg-primary">{{ dayDifference }}</span> 일 동안 진행됩니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from "vue";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import apiWrapper from "../../util/axios/axios.js";

export default defineComponent({
  components: { ProjectSidebar },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  methods: {
    async initializeProjectData() {
      try {
        // API 호출
        const projectData = await apiWrapper.getData(`/api/studio/${this.projectId}/project`);
        console.log("API 응답 데이터:", projectData);

        const projectInfo = projectData.projectInfo;
        if (!projectInfo) {
          console.error("프로젝트 정보가 없습니다.");
          return;
        }

        // fundingStartDate와 fundingEndDate를 초기화
        if (projectInfo.fundingStartDate) {
          this.startDate = new Date(projectInfo.fundingStartDate).toISOString().split("T")[0];
        }
        if (projectInfo.fundingEndDate) {
          this.endDate = new Date(projectInfo.fundingEndDate).toISOString().split("T")[0];
        }

        console.log("초기화된 날짜:", {
          startDate: this.startDate,
          endDate: this.endDate,
        });
      } catch (error) {
        console.error("프로젝트 데이터 초기화 중 오류 발생:", error);
        alert("프로젝트 데이터를 불러오는 중 문제가 발생했습니다.");
      }
    },

    async saveProject() {
      try {
        // LocalDateTime 형식으로 변환
        let startDateTime = null;
        let endDateTime = null;

        if (this.startDate) {
          startDateTime = new Date(this.startDate).toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'로 변환
        } else {
          console.warn("startDate가 비어 있습니다.");
        }

        if (this.endDate) {
          endDateTime = new Date(this.endDate).toISOString().slice(0, 19); // 'YYYY-MM-DDTHH:mm:ss'로 변환
        } else {
          console.warn("endDate가 비어 있습니다.");
        }

        // DTO 객체 생성
        const requestBody = {
          fundingStartDate: startDateTime,
          fundingEndDate: endDateTime,
        };

        console.log("전송 데이터:", requestBody); // 디버깅용

        // 서버 요청
        const response = await apiWrapper.postData(`/api/studio/${this.projectId}/schedule`, requestBody);

        if (response.status === 200) {
          alert("프로젝트 일정이 성공적으로 저장되었습니다.");
          this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
          console.log("응답 데이터:", response.data);
        }
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
        alert("프로젝트 일정 저장 중 오류가 발생했습니다.");
      }
    }
    ,
    exit() {
      const shouldExit = confirm("저장하지 않고 나가시겠습니까?");
      if (shouldExit) {
        this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
      }
    }
  },
  setup() {
    // 라우트에서 projectId 가져오기

    // 날짜 상태 정의
    const startDate = ref("");
    const endDate = ref("");

    // 프로젝트 기간 계산 로직
    const dayDifference = computed(() => {
      if (startDate.value && endDate.value) {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);

        if (!isNaN(start) && !isNaN(end) && end >= start) {
          const timeDifference = end - start;
          return timeDifference / (1000 * 60 * 60 * 24); // 밀리초를 일수로 변환
        }
      }
      return 0; // 유효한 날짜가 없으면 0으로 표시
    });

    // 종료일자 감시 및 유효성 검사
    watch(endDate, (newEndDate) => {
      if (startDate.value && newEndDate) {
        const start = new Date(startDate.value);
        const end = new Date(newEndDate);

        if (end < start) {
          alert("종료일자는 시작일자보다 앞설 수 없습니다.");
          endDate.value = ""; // 종료일자 초기화
        }
      }
    });

    return {
      startDate,
      endDate,
      dayDifference,
    };
  },
  async mounted() {
    await this.initializeProjectData();
  },
});
</script>

<style scoped>
</style>
