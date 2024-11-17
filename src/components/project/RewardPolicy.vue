<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
        <!-- ProjectSidebar에 projectId 바인딩 -->
        <ProjectSidebar :projectId="projectId" />
        <button class="btn btn-primary w-100" @click="saveProject">저장 하기</button>
      </div>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h4 class="fw-bold text-start">리워드 정책 <span class="text-danger">*</span></h4>
        <p class="text-muted small text-start">
          서포터님들에게 제공할 리워드 정보를 입력해주세요. <br>
          허위 사실을 기재하거나, 상품 정보를 고시하지 않는 경우 <br>
          모든 책임은 메이커님에게 있으므로 정확한 정보를 입력해주세요.
        </p>

        <!-- 리워드 기본 정책 -->
        <div class="bg-light p-3 rounded-3">
          <div class="d-flex align-items-center text-primary fw-bold mb-2">
            <i class="bi bi-info-circle-fill me-2"></i> 리워드 기본 정책
          </div>
          <ol class="small text-start" style="list-style-type: decimal;">
            <li>결제 취소 및 환불 안내</li>
            <li>프로젝트 종료 전 까지 언제든 결제 취소 가능해요.</li>
            <li>환불은 참여 내역에서 신청할 수 있어요.</li>
            <li>환불 신청은 리워드 수령(배송 완료) 후 7일 이내 가능해요.</li>
            <li>환불 신청 후 메이커와 소통하여 리워드를 발송해주세요.</li>
            <li>단순변심: 반품비 서포터 부담</li>
            <li>리워드 품질 하자: 반품비 메이커 부담</li>
          </ol>
        </div>

        <div class="reward-details text-start mb-4">
          <label class="mt-4">품명 및 모델명</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.modelName"
              placeholder="내용을 입력해 주세요"
          />

          <label class="mt-4">제품 소재</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.productMaterial"
              placeholder="내용을 입력해 주세요"
          />

          <label class="mt-4">색상</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.color"
              placeholder="내용을 입력해 주세요"
          />

          <label class="mt-4">치수</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.field"
              placeholder="내용을 입력해 주세요"
          />

          <label class="mt-4">제조자, 수입품의 경우 수입자를 함께 표기</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.manufacturer"
              placeholder="내용을 입력해 주세요"
          />

          <label class="mt-4">제조국</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.manufacturingCountry"
              placeholder="내용을 입력해 주세요"
          />

          <label class="mt-4">제조연월</label>
          <input
              type="text"
              class="form-control w-50 mt-2"
              v-model="policy.manufactureDate"
              placeholder="예) 2018년 10월"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import apiWrapper from "../../util/axios/axios.js";

export default defineComponent({
  name: "RewardForm",
  components: {
    ProjectSidebar,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 정책 정보 데이터
      policy: {
        modelName: "",
        productMaterial: "",
        color: "",
        field: "",
        manufacturer: "",
        manufacturingCountry: "",
        manufactureDate: "",
      },
    };
  },
  methods: {
    async saveProject() {
      try {
        // 정책 데이터 DTO 매핑
        const requestBody = { ...this.policy };

        console.log("전송 데이터:", requestBody); // 디버깅용

        // API 호출
        const response = await apiWrapper.postData(`/api/studio/${this.projectId}/policy`, requestBody);

        if (response.status === 200) {
          alert("정책 정보가 성공적으로 저장되었습니다.");
          this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
          console.log("응답 데이터:", response.data);
        }
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
        alert("정책 정보 저장 중 오류가 발생했습니다.");
      }
    },
  },
});
</script>

<style scoped>
</style>
