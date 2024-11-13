<template>
  <div class="container-fluid">
    <div class="row">
      <ProjectSidebar />

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <h2 class="fw-bold text-start">프로젝트 시작</h2>
        <p class="text-start">프로젝트가 성공할 수 있게 와디즈가 응원할게요.</p>
        <hr />

        <!-- 프로젝트 제목 -->
        <label for="project-title" class="fw-bold text-start d-block">프로젝트 제목</label>
        <input type="text" id="project-title" class="form-control w-50 mb-3" placeholder="프로젝트 제목을 입력하세요" />

        <!-- 카테고리 -->
        <label for="project-category" class="fw-bold text-start d-block">카테고리 *</label>
        <p class="text-muted text-start">프로젝트와 가장 잘 어울리는 카테고리를 선택해 주세요.<br />프로젝트를 만들고 바꿀 수 있어요</p>

        <!-- Button to open modal instead of input field -->
        <button id="project-category" class="form-control w-50 text-start" @click="showModal = true">카테고리 선택</button>
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
import { defineComponent } from "vue";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";

export default defineComponent({
  components: { ProjectSidebar },
  data() {
    return {
      showModal: false,
      selectedUpperCategory: null,
      selectedLowerCategory: null,
      upperCategories: [
        { idx: 1, name: "상위 카테고리 1" },
        { idx: 2, name: "상위 카테고리 2" },
        { idx: 3, name: "상위 카테고리 3" },
      ],
      subCategories: [
        { idx: 101, name: "하위 카테고리 1-1", upperIdx: 1 },
        { idx: 102, name: "하위 카테고리 1-2", upperIdx: 1 },
        { idx: 201, name: "하위 카테고리 2-1", upperIdx: 2 },
        { idx: 202, name: "하위 카테고리 2-2", upperIdx: 2 },
        { idx: 301, name: "하위 카테고리 3-1", upperIdx: 3 },
      ],
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
    openCategoryModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedUpperCategory = null;
      this.selectedLowerCategory = null;
    },
    selectUpperCategory(idx) {
      this.selectedUpperCategory = idx;
      this.selectedLowerCategory = null;
    },
    selectLowerCategory(idx) {
      this.selectedLowerCategory = idx;
    },
    confirmSelection() {
      if (this.selectedLowerCategory) {
        // 하위 카테고리의 idx 값을 DB에 전달할 준비를 합니다.
        console.log("선택된 하위 카테고리 idx:", this.selectedLowerCategory);
        this.closeModal();
      } else {
        alert("하위 카테고리를 선택해주세요.");
      }
    },
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
</style>
