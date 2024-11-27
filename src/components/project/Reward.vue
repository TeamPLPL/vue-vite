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
        <h4 class="fw-bold text-start">리워드 추가 <span class="text-danger">*</span></h4>
        <p class="text-muted small text-start">
          서포터님들에게 제공할 리워드를 입력해주세요.
        </p>

        <!-- 리워드 추가 조건 -->
        <div class="bg-light p-3 rounded-3 mb-4">
          <div class="d-flex align-items-center text-primary fw-bold mb-2">
            <i class="bi bi-info-circle-fill me-2"></i> 리워드 추가 조건
          </div>
          <ul class="list-unstyled small text-muted ms-3 text-start">
            <li><span class="fw-bold">리워드 순서:</span> 혜택이 좋은 순서대로 등록해주세요.</li>
            <li><span class="fw-bold">제한 수량:</span> 각 리워드별 제공할 수 있는 수량을 입력해주세요.</li>
            <li><span class="fw-bold">옵션 조건:</span> 사이즈, 색상 등의 옵션 설정이 필요하면 추가해 주세요.</li>
            <li><span class="fw-bold">주의 사항:</span> 자사몰 및 다른 채널에서 판매된 적 있는 리워드는 단독 리워드로 제공할 수 없어요.</li>
          </ul>
        </div>

        <!-- 리워드 추가 버튼 -->
        <button @click="openModal" class="btn btn-outline-primary mb-3">
          + 리워드 추가
        </button>

        <!-- 리워드 리스트 -->
        <div v-for="(reward, index) in rewards" :key="index" class="mb-3 p-3 border rounded" style="width: 50%;">
          <div class="text-start">
             <h5 class="fw-bold">{{ formatPrice(reward.price) }} 원</h5>
            <p><strong>리워드 명 : {{ reward.rewardName }}</strong></p>
            <p><b>리워드 설명 :</b> {{ reward.rewardDescription }}</p>
            <p>
              <strong>제한 수량 :</strong> {{ reward.limitQuantity }} 개
            </p>
            <p v-if="reward.deliveryOption === 'yes'">
              <strong>배송비 :</strong> {{ formatPrice(reward.deliveryFee) }} 원
            </p>
            <div class="d-flex gap-2 mt-2">
              <button @click="editReward(index)" class="btn btn-outline-secondary">
                수정
              </button>
              <button @click="deleteReward(index)" class="btn btn-outline-danger">
                삭제
              </button>
            </div>
          </div>
        </div>

        <!-- 리워드 추가 모달 -->
        <div v-if="showModal" class="modal d-block" tabindex="-1">
          <div class="modal-dialog modal-lg w-50">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ editingIndex === null ? '리워드 추가' : '리워드 수정' }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <!-- 리워드 추가/수정 폼 -->
                <form @submit.prevent="saveReward">
                  <div class="text-start mt-3 w-25">
                    <label for="price">금액</label>
                    <div class="d-flex align-items-center mt-2">
                      <input
                          type="text"
                          class="form-control"
                          v-model="newReward.price"
                          placeholder="0"
                          aria-label="Amount"
                      />
                      <span class="ms-2">원</span>
                    </div>
                  </div>

                  <div class="form-group text-start mt-3">
                    <label for="rewardName">리워드명</label>
                    <input
                        type="text"
                        class="form-control mt-2"
                        v-model="newReward.rewardName"
                        placeholder="예시) [얼리버드] 베이지 이불·베개 1세트"
                    />
                  </div>

                  <div class="form-group text-start mt-3">
                    <label for="rewardDescription">리워드 설명</label>
                    <textarea
                        class="form-control mt-2"
                        v-model="newReward.rewardDescription"
                        rows="3"
                        placeholder="리워드 구성과 혜택을 간략하게 설명해 주세요."
                    ></textarea>
                  </div>

                  <div class="form-group text-start mt-3 w-25">
                    <label for="limitQuantity">제한 수량</label>
                    <div class="d-flex align-items-center mt-2">
                      <input
                          type="text"
                          class="form-control"
                          v-model="newReward.limitQuantity"
                          placeholder="0"
                      />
                      <span class="ms-2">개</span>
                    </div>
                  </div>

                  <div class="form-group text-start mt-3">
                    <label>배송 여부</label>
                    <div class="form-check mt-2">
                      <input
                          class="form-check-input"
                          type="radio"
                          v-model="newReward.deliveryOption"
                          value="yes"
                          id="deliveryYes"
                      />
                      <label class="form-check-label" for="deliveryYes">배송비 있음</label>
                    </div>
                    <div class="form-check mt-2">
                      <input
                          class="form-check-input"
                          type="radio"
                          v-model="newReward.deliveryOption"
                          value="no"
                          id="deliveryNo"
                      />
                      <label class="form-check-label" for="deliveryNo">배송비 없음</label>
                    </div>
                  </div>

                  <div v-if="newReward.deliveryOption === 'yes'" class="form-group text-start mt-3 w-25">
                    <label for="deliveryFee">배송비</label>
                    <div class="d-flex align-items-center mt-2">
                      <input
                          type="text"
                          class="form-control"
                          v-model="newReward.deliveryFee"
                          placeholder="0"
                      />
                      <span class="ms-2">원</span>
                    </div>
                  </div>

                  <div class="form-group text-start mt-3 w-50">
                    <label for="limitQuantity">리워드 배송 예상 날짜</label>
                    <div class="d-flex align-items-center mt-2">
                      <input
                          type="date"
                          class="form-control"
                          v-model="newReward.deliveryStartDate"
                          placeholder="0"
                      />
                    </div>
                  </div>

                  <div class="mt-4 d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary me-2" @click="closeModal">
                      취소
                    </button>
                    <button type="submit" class="btn btn-primary">
                      {{ editingIndex === null ? '추가' : '수정 완료' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
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
import lib from "../../util/scripts/lib.js";

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
      showModal: false,
      rewards: [],
      newReward: {
        price: 0,
        rewardName: "",
        rewardDescription: "",
        limitQuantity: 0,
        deliveryOption: "yes",
        deliveryFee: 0,
        deliveryStartDate: null, // 배송 예상 날짜
      },
      editingIndex: null, // 현재 수정 중인 리워드의 인덱스
    };
  },
  mounted() {
    this.fetchRewards(); // 컴포넌트가 마운트될 때 리워드 데이터를 가져옴
  },
  methods: {
    async fetchRewards() {
      try {
        const response = await apiWrapper.getData(
            `/api/${this.projectId}/getrewards`
        );

        this.rewards = response.map((reward) => ({
          id: reward.rewardId,
          rewardName: reward.rewardName,
          price: reward.price,
          rewardDescription: reward.explanation,
          deliveryFee: reward.deliveryFee,
          deliveryStartDate: reward.deliveryStartDate
              ? reward.deliveryStartDate.split("T")[0] // 날짜만 추출
              : null,
          limitQuantity: reward.quantityLimit,
          supportedCnt: reward.supportedCnt,
          count: reward.count,
          deliveryOption: reward.deliveryFee > 0 ? "yes" : "no",
        }));

        console.log("리워드 데이터 초기화 완료:", this.rewards);
      } catch (error) {
        console.error("리워드 데이터 가져오기 실패:", error);
      }
    },
    deleteReward(index) {
      this.rewards.splice(index, 1); // 배열에서 제거
      console.log("로컬에서 삭제 처리:", this.rewards);
    },
    openModal() {
      this.resetForm();
      this.showModal = true;
      this.editingIndex = null; // 새로 추가 시에는 null
    },
    saveReward() {
      if (this.editingIndex === null) {
        // 새로 추가
        this.rewards.push({ ...this.newReward });
      } else {
        // 기존 리워드 수정
        this.rewards.splice(this.editingIndex, 1, { ...this.newReward });
      }
      this.closeModal();
    },
    editReward(index) {
      this.newReward = { ...this.rewards[index] };
      this.showModal = true;
      this.editingIndex = index;
    },
    closeModal() {
      this.resetForm();
      this.showModal = false;
    },
    resetForm() {
      this.newReward = {
        price: 0,
        rewardName: "",
        rewardDescription: "",
        limitQuantity: 0,
        deliveryOption: "yes",
        deliveryFee: 0,
        deliveryStartDate: null, // 초기화
      };
    },
    async saveProject() {
      try {
        console.log("저장 전 rewards 상태:", this.rewards);

        // 서버에 업데이트된 rewards 배열 전송
        const requestBody = this.rewards.map((reward) => ({
          id: reward.id || null,
          rewardName: reward.rewardName,
          price: reward.price,
          explanation: reward.rewardDescription,
          deliveryFee: reward.deliveryOption === "yes" ? reward.deliveryFee : 0,
          deliveryStartDate: reward.deliveryStartDate
              ? `${reward.deliveryStartDate}T00:00:00`
              : null,
          quantityLimit: reward.limitQuantity,
        }));

        console.log("전송 데이터:", requestBody);

        const response = await apiWrapper.postData(
            `/api/studio/${this.projectId}/reward`,
            requestBody
        );

        if (response.status === 200) {
          alert("리워드가 성공적으로 저장되었습니다.");
          this.$router.push(`/studio/${this.projectId}/project/`);
        }
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
        alert("리워드 저장 중 오류가 발생했습니다.");
      }
    },
    formatPrice(val) {
      return lib.getNumberFormatted(val);
    },
    exit() {
      const shouldExit = confirm("저장하지 않고 나가시겠습니까?");
      if (shouldExit) {
        this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
      }
    },
  },
});
</script>



<style scoped>
.modal {
  background: rgba(0, 0, 0, 0.5); /* 모달 뒷배경 어둡게 */
}
</style>
