<template>
  <div class="container-fluid">
    <div class="row">
      <ProjectSidebar />

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
            <h5 class="fw-bold"> {{reward.price }} 원</h5>
            <p><strong>{{ reward.rewardName }}</strong></p>
            <p>{{ reward.rewardDescription }}</p>
            <p>
              <strong>제한 수량:</strong> {{ reward.limitQuantity }} 개
            </p>
            <p v-if="reward.deliveryOption === 'yes'">
              <strong>배송비:</strong> {{ reward.deliveryFee }} 원
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
                      <label class="form-check-label" for="deliveryYes">배송비 있음 <br> <span class="small text-secondary">(택배로 리워드를 전달해요.)</span></label>
                    </div>
                    <div class="form-check mt-2">
                      <input
                          class="form-check-input"
                          type="radio"
                          v-model="newReward.deliveryOption"
                          value="no"
                          id="deliveryNo"
                      />
                      <label class="form-check-label" for="deliveryNo">배송비 없음 <br> <span class="small text-secondary">(배송비 없이 리워드를 전달해요.)</span></label>
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
import lib from '../../util/scripts/lib.js';
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";

export default {
  name: "RewardForm",
  components: {
    ProjectSidebar,
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
      },
      editingIndex: null, // 현재 수정 중인 리워드의 인덱스
    };
  },
  methods: {
    openModal() {
      this.resetForm();
      this.showModal = true;
      this.editingIndex = null; // 새로 추가 시에는 null
    },
    saveReward() {
      if (this.editingIndex === null) {
        // 새로 추가
        this.rewards.push({...this.newReward});
      } else {
        // 기존 리워드 수정
        this.rewards.splice(this.editingIndex, 1, {...this.newReward});
      }
      this.closeModal();
    },
    editReward(index) {
      this.newReward = {...this.rewards[index]};
      this.showModal = true;
      this.editingIndex = index;
    },
    deleteReward(index) {
      this.rewards.splice(index, 1);
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
      };
    },
    formatNumber(value) {
      return lib.getNumberFormatted(value);
    }
  },
};
</script>



<style scoped>
.card {
  border: 1px solid #ddd;
  border-radius: 8px;
}

.card-body {
  padding: 16px;
}

.modal {
  background: rgba(0, 0, 0, 0.5); /* 모달 뒷배경 어둡게 */
}
</style>
