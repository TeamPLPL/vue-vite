<template>
  <nav class="navbar sticky-top navbar-light bg-light">
    <div class="container-sm">
      <div class="container-fluid px-3">
        <div class="d-flex align-items-center w-100">
          <!-- 메인 카테고리 네비게이션 -->
          <div class="nav-scroll me-3">
            <ul class="nav nav-underline flex-nowrap">
              <li class="nav-item" v-for="(item, index) in menuItems" :key="index"
                @mouseenter="handleNavItemMouseEnter(item.mainCategoryId)">
                <a class="nav-link" href="#" :class="{ active: activeCategory === item.mainCategoryId }"
                  @click.prevent="setActiveCategory(item.mainCategoryId)">
                  {{ item.mainCategoryName }}
                </a>
              </li>
            </ul>
          </div>

          <!-- 검색 폼 -->
          <form class="d-flex ms-auto search-form" role="search">
            <div class="input-group">
              <input class="form-control border-end-0" type="search" placeholder="Search" aria-label="Search">
              <button class="btn border-start-0 search-button" type="submit">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- 서브 카테고리 리스트 표시 영역 -->
      <div class="sub-category-container" v-if="shouldShowSubCategories" @mouseenter="handleSubCategoryMouseEnter"
        @mouseleave="handleSubCategoryMouseLeave">
        <div class="container-fluid px-3">
          <ul class="sub-category-list">
            <li v-for="(subCategory, index) in subCategoryList" :key="index">
              <a href="#" @click.prevent="handleSubCategoryClick(subCategory.subCategoryId)">
                {{ subCategory.subCategoryName }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </nav>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import apiWrapper from '../../util/axios/axios';

const menuItems = ref([]);
const subCategoryList = ref([]);
const isHoveringNavItem = ref(false);
const isHoveringSubCategory = ref(false);
const activeCategory = ref(null);

const shouldShowSubCategories = computed(() =>
  subCategoryList.value.length > 0 && (isHoveringNavItem.value || isHoveringSubCategory.value)
);

onMounted(async () => {
  await setMainCategories();
});

const setMainCategories = async () => {
  try {
    const data = await apiWrapper.fetchMainCategories();
    if (Array.isArray(data)) {
      menuItems.value = data;
    } else if (data && Array.isArray(data.categories)) {
      menuItems.value = data.categories;
    } else {
      console.error("Unexpected data structure:", data);
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
  }
};

const setSubCategories = async (parentId) => {
  try {
    const data = await apiWrapper.fetchSubCategories(parentId);
    if (Array.isArray(data)) {
      subCategoryList.value = data;
    } else if (data && Array.isArray(data.categories)) {
      subCategoryList.value = data.categories;
    } else {
      console.error("Unexpected data structure:", data);
    }
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error);
  }
};

const handleNavItemMouseEnter = (parentId) => {
  isHoveringNavItem.value = true;
  setSubCategories(parentId);
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
  }, 400);
};

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

const handleSubCategoryClick = (subCategoryId) => {
  console.log(`Clicked sub-category: ${subCategoryId}`);
  // 여기에 서브 카테고리 클릭 시 수행할 로직을 추가하세요
};
</script>

<style scoped>
.nav-scroll {
  overflow-x: auto;
  flex-grow: 1;
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.nav-scroll::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

.nav-scroll .nav {
  flex-wrap: nowrap;
}

.nav-item {
  display: flex;
}

.nav-link {
  white-space: nowrap;
  /* 텍스트 줄바꿈 방지 */
  text-align: center;
  /* 텍스트 중앙 정렬 */
}

.search-form {
  width: 250px;
  min-width: 200px;
}

.search-button {
  border-color: #dee2e6;
  background-color: white;
}

.search-button:hover,
.search-button:focus {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.form-control:focus,
.search-button:focus {
  box-shadow: none;
  border-color: #dee2e6;
}

.sub-category-container {
  width: 100%;
  background-color: #f8f9fa;
  padding: 10px 0;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 999;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sub-category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 0;
  margin: 0;
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

@media (max-width: 768px) {
  .search-form {
    width: 100%;
    margin-top: 10px;
  }
}
</style>