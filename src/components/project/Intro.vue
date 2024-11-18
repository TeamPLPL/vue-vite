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
        <h2 class="fw-bold text-start">프로젝트 시작</h2>
        <p class="text-start">프로젝트가 성공할 수 있게 와디즈가 응원할게요.</p>
        <hr/>

        <!-- 프로젝트 제목 -->
        <label for="project-title" class="fw-bold text-start mt-4 d-block">
          프로젝트 제목 <span class="text-danger">*</span>
        </label>
        <input
            type="text"
            id="project-title"
            class="form-control w-50 mt-2 mb-3"
            placeholder="프로젝트 제목을 입력하세요"
            v-model="fundingTitle"
        />

        <!-- 카테고리 -->
        <label for="project-category" class="fw-bold mt-5 text-start d-block">
          카테고리 <span class="text-danger">*</span>
        </label>
        <p class="text-muted small text-start">
          프로젝트와 가장 잘 어울리는 카테고리를 선택해 주세요.
        </p>

        <!-- Button to open modal -->
        <button id="project-category" class="form-control w-50 text-start" @click="openCategoryModal">
          카테고리 선택
        </button>

        <!-- 선택된 카테고리 표시 -->
        <div v-if="selectedCategoryText" class="mt-3 text-start"> <span class="badge bg-primary text-wrap fs-4"> {{ selectedCategoryText }}</span> </div>

        <!-- 목표 금액 입력 -->
        <label for="project-amount" class="fw-bold text-start mt-5 d-block">
          목표 금액 <span class="text-danger">*</span>
        </label>
        <input
            type="text"
            id="project-amount"
            class="form-control w-50 mt-2 mb-3"
            placeholder="프로젝트 목표 금액을 입력하세요"
            v-model="amount"
            @input="formatAmount"
        />
        <!-- 포맷팅된 금액 표시 -->
        <div class="text-muted small text-start">{{ formattedAmount }}</div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal d-block" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">카테고리 선택</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body d-flex">
            <!-- 상위 카테고리 리스트 -->
            <div class="col-6 border-end pe-3">
              <h6 class="text-start fw-bold">상위 카테고리</h6>
              <ul class="list-group">
                <li
                    v-for="category in upperCategories"
                    :key="category.idx"
                    class="list-group-item"
                    :class="{ 'active': selectedUpperCategory === category.idx }"
                    @click="selectUpperCategory(category.idx)"
                >
                  {{ category.name }}
                </li>
              </ul>
            </div>

            <!-- 하위 카테고리 리스트 -->
            <div class="col-6 ps-3">
              <h6 class="text-start fw-bold">하위 카테고리</h6>
              <ul class="list-group">
                <li
                    v-for="subcategory in filteredSubCategories"
                    :key="subcategory.idx"
                    class="list-group-item"
                    :class="{ 'active': selectedLowerCategory === subcategory.idx }"
                    @click="selectLowerCategory(subcategory.idx)"
                >
                  {{ subcategory.name }}
                </li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="confirmSelection">확인</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import apiWrapper from "../../util/axios/axios.js";

export default defineComponent({
  components: {ProjectSidebar},
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fundingTitle: "", // 프로젝트 제목

      showModal: false,
      selectedUpperCategory: null,
      selectedLowerCategory: null,
      upperCategories: [],
      subCategories: [],
      selectedCategoryText: "", // 선택된 카테고리 정보를 저장

      amount: '', // 입력한 원본 값
      formattedAmount: '', // 포맷팅된 값
    };
  },
  computed: {
    filteredSubCategories() {
      return this.subCategories.filter(
          (subcategory) => subcategory.upperIdx === this.selectedUpperCategory
      );
    },
  },
  methods: {
    async openCategoryModal() {
      this.showModal = true;
      try {
        // Main Category 데이터를 가져옴
        const mainCategories = await apiWrapper.getData("/api/maincategory");

        this.upperCategories = mainCategories.map(category => ({
          idx: category.mainCategoryId,
          name: category.mainCategoryName,
        }));

        // Sub Category 데이터를 가져옴
        const subCategories = await apiWrapper.getData("/api/subcategory");

        this.subCategories = subCategories.map(subCategory => ({
          idx: subCategory.subCategoryId,
          name: subCategory.subCategoryName,
          upperIdx: subCategory.mainCategory, // 상위 카테고리와의 연결 정보 포함
        }));
      } catch (error) {
        console.error("카테고리 데이터 가져오기 실패:", error);
        alert("카테고리 데이터를 불러오는 중 문제가 발생했습니다.");
      }
    },
    async saveProject() {
      console.log("저장 직전 하위 카테고리 ID:", this.selectedLowerCategory); // 디버깅용

      if (!this.selectedLowerCategory) {
        alert("카테고리를 선택해주세요.");
        return;
      }

      try {
        // DTO 객체 생성
        const requestBody = {
          fundingTitle: this.fundingTitle, // 프로젝트 제목
          subCategory: this.selectedLowerCategory, // 선택된 하위 카테고리 ID
          targetAmount: parseInt(this.amount.replace(/,/g, ''), 10), // 숫자로 변환된 목표 금액
        };

        console.log("전송 데이터:", requestBody); // 디버깅용

        // 서버 요청
        const response = await apiWrapper.postData(`/api/studio/${this.projectId}/intro`, requestBody);

        if (response.status === 200) {
          alert("프로젝트 소개가 성공적으로 저장되었습니다.");
          this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
          console.log("응답 데이터:", response.data);
        }
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
        alert("프로젝트 소개 저장 중 오류가 발생했습니다.");
      }
    },
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

        this.fundingTitle = projectInfo.fundingTitle || "";
        this.amount = projectInfo.targetAmount ? projectInfo.targetAmount.toString() : "";
        this.formattedAmount = this.amount
            ? new Intl.NumberFormat("ko-KR").format(this.amount) + "원"
            : "";
        // 상위 카테고리 및 하위 카테고리 이름 초기화
        this.selectedUpperCategory = projectInfo.mainCategoryId;
        this.selectedLowerCategory = projectInfo.subCategoryId;

        // 이름 초기화
        this.mainCategoryName = projectInfo.mainCategoryName || "";
        this.subCategoryName = projectInfo.subCategoryName || "";

        // UI 데이터와 동기화
        const upperCategory = this.upperCategories.find(
            (category) => category.idx === this.selectedUpperCategory
        );
        if (upperCategory) {
          upperCategory.name = this.mainCategoryName;
        }

        const lowerCategory = this.subCategories.find(
            (subcategory) => subcategory.idx === this.selectedLowerCategory
        );
        if (lowerCategory) {
          lowerCategory.name = this.subCategoryName;
        }

        // 선택된 카테고리 텍스트 초기화
        if (this.mainCategoryName && this.subCategoryName) {
          this.selectedCategoryText = `${this.mainCategoryName} > ${this.subCategoryName}`;
        }

        console.log("초기화된 데이터:", {
          selectedUpperCategory: this.selectedUpperCategory,
          selectedLowerCategory: this.selectedLowerCategory,
          mainCategoryName: this.mainCategoryName,
          subCategoryName: this.subCategoryName,
        });

        // DOM 업데이트 후 확인
        await this.$nextTick();
        console.log("DOM 업데이트 완료");
      } catch (error) {
        console.error("프로젝트 데이터 초기화 중 오류:", error);
        alert("프로젝트 데이터를 불러오는 중 문제가 발생했습니다.");
      }
    },
    closeModal() {
      this.showModal = false;
      // this.selectedUpperCategory = null;
      // this.selectedLowerCategory = null;
    },
    selectUpperCategory(idx) {
      this.selectedUpperCategory = idx;
      this.selectedLowerCategory = null;
    },
    selectLowerCategory(idx) {
      this.selectedLowerCategory = idx;
      console.log("선택된 하위 카테고리 ID:", this.selectedLowerCategory); // 디버깅용
    },
    confirmSelection() {
      if (this.selectedLowerCategory) {
        const mainCategory = this.upperCategories.find(
            (category) => category.idx === this.selectedUpperCategory
        );
        const subCategory = this.subCategories.find(
            (subcategory) => subcategory.idx === this.selectedLowerCategory
        );

        // 선택된 카테고리 텍스트 설정
        if (mainCategory && subCategory) {
          this.selectedCategoryText = `${mainCategory.name} > ${subCategory.name}`;
        }

        this.closeModal();
      } else {
        alert("하위 카테고리를 선택해주세요.");
      }
    },
    formatAmount(event) {
      const inputValue = event.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
      this.amount = inputValue; // 원본 값 저장
      this.formattedAmount = inputValue
          ? new Intl.NumberFormat('ko-KR').format(inputValue) + '원'
          : '';
    },
  },
  async mounted() {
    await this.initializeProjectData();
  },
});
</script>

<style scoped>
/* Modal Styling */
.modal {
  background: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 800px;
}

.list-group-item.active {
  background-color: #007bff;
  color: #ffffff;
}
.save-button {
  margin-top: 3rem; /* 상단 여백 */
  padding: 0.5rem 1rem; /* 내부 여백 */
}
</style>
