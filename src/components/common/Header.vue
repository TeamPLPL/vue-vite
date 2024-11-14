<template>
  <nav class="navbar sticky-top navbar-light bg-light">
    <div class="container-sm">
      <!-- 메인 카테고리 네비게이션 -->
      <ul class="nav nav-underline">
        <li
          class="nav-item"
          v-for="(item, index) in menuItems"
          :key="index"
          @mouseenter="handleNavItemMouseEnter(item.mainCategoryId)"
          @mouseleave="handleNavItemMouseLeave"
        >
          <a 
            class="nav-link" 
            href="#" 
            :class="{ active: activeCategory === item.mainCategoryId }"
            @click.prevent="setActiveCategory(item.mainCategoryId)"
          >
            {{ item.mainCategoryName }}
          </a>
        </li>
      </ul>

      <!-- 검색 폼 -->
      <form class="d-flex w-25 custom-form-width search" role="search">
        <div class="input-group">
          <input class="form-control border-end-0" type="search" placeholder="Search" aria-label="Search">
          <button class="btn border-start-0 search-button" type="submit">
            <i class="bi bi-search"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- 서브 카테고리 리스트 표시 영역 -->
    <div
      class="sub-category-container"
      v-if="shouldShowSubCategories"
      @mouseenter="handleSubCategoryMouseEnter" 
      @mouseleave="handleSubCategoryMouseLeave"
    >
      <div class="container-sm">
        <ul class="sub-category-list">
          <li v-for="(subCategory, index) in subCategoryList" :key="index">
            <a href="#" @click.prevent="handleSubCategoryClick(subCategory.subCategoryId)">
              {{ subCategory.subCategoryName }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const menuItems = ref([]);
    const subCategoryList = ref([]);
    const isHoveringNavItem = ref(false);
    const isHoveringSubCategory = ref(false);
    const activeCategory = ref(null);

    const shouldShowSubCategories = computed(() => 
      subCategoryList.value.length > 0 && (isHoveringNavItem.value || isHoveringSubCategory.value)
    );

    onMounted(async () => {
      try {
        const response = await axios.get('/api/funding/main-categories');
        menuItems.value = response.data;
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
      }
    });

    const fetchSubCategories = async (parentId) => {
      try {
        const response = await axios.get(`/api/funding/sub-categories/${parentId}`);
        subCategoryList.value = response.data;
      } catch (error) {
        console.error("서브 카테고리 API 요청 중 오류 발생:", error);
      }
    };

    const handleNavItemMouseEnter = (parentId) => {
      isHoveringNavItem.value = true;
      fetchSubCategories(parentId);
    };

    const handleSubCategoryMouseEnter = () => {
      isHoveringSubCategory.value = true;
    };

    const handleSubCategoryMouseLeave = () => {
      isHoveringNavItem.value = false;
      isHoveringSubCategory.value = false;
    };

    const handleNavItemMouseLeave = () => {
      setTimeout(() => {
        if (!isHoveringSubCategory.value) {
          isHoveringNavItem.value = false;
        }
      }, 300); // 100ms 지연
    };


    const setActiveCategory = (categoryId) => {
      activeCategory.value = categoryId;
    };

    const handleSubCategoryClick = (subCategoryId) => {
      console.log(`Clicked sub-category: ${subCategoryId}`);
      // 여기에 서브 카테고리 클릭 시 수행할 로직을 추가하세요
    };

    return {
      menuItems,
      subCategoryList,
      shouldShowSubCategories,
      activeCategory,
      handleNavItemMouseEnter,
      handleNavItemMouseLeave,
      handleSubCategoryMouseEnter,
      handleSubCategoryMouseLeave,
      setActiveCategory,
      handleSubCategoryClick,
    };
  }
};
</script>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
}

.sub-category-container {
  width: 100%;
  min-height: 20px;
  background-color: #f8f9fa;
  padding: 10px 20px;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.sub-category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 0;
  margin: 0;
}

.sub-category-list li {
  list-style: none;
}

.sub-category-list a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.sub-category-list a:hover {
  color: #007bff;
}

.form-control:focus {
  outline: none;
  box-shadow: none;
  border-color: #dee2e6;
}

@media (max-width: 540px) {
  .custom-form-width {
    width: 100% !important;
  }
}

.search {
  min-width: 250px !important;
}

/* 검색 버튼 스타일 수정 */
.search-button {
  border-color: #dee2e6;
  background-color: white;
}

.search-button:hover,
.search-button:focus {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

/* 입력 필드와 버튼이 포커스되었을 때 테두리 스타일 일치 */
.form-control:focus,
.search-button:focus {
  box-shadow: none;
  border-color: #dee2e6;
}
</style>