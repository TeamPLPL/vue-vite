<template>
  <div class="container-fluid">
    <div class="row">
      <ProjectSidebar />

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

export default defineComponent({
  components: { ProjectSidebar },
  setup() {
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
});
</script>

<style scoped>
</style>
