<template>
    <div>
        <h2 id="selected-category-title">{{ categoryTitle }}</h2>
        <div v-if="noContentMessage" class="alert alert-info">
            {{ noContentMessage }}
        </div>
        <div v-else>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                <div class="col" v-for="(funding, index) in categoryFundings" :key="index">
                    <div class="card h-100" @click="redirectToFundingDetail(funding.id)">
                        <img :src="getThumbnailUrl(funding.thumbnailImgUrl)" class="card-img-top"
                            :alt="funding.fundingTitle" @error="handleImageError">
                        <div class="card-body">
                            <h5 class="card-title">{{ funding.fundingTitle }}</h5>
                            <p class="card-text">작성자: {{ funding.makerNick }}</p>
                            <p class="card-text">달성률: {{ funding.achievementRate }}</p>
                            <p class="card-text">후원자 수: {{ funding.supportCnt }}</p>
                            <p class="card-text">찜 수: {{ funding.wishlistCnt }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <nav aria-label="Page navigation" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: categoryFundings.first }">
                        <a class="page-link" href="#" @click.prevent="changePage(categoryFundings.number - 1)">이전</a>
                    </li>
                    <li class="page-item" v-for="pageNumber in displayedPages" :key="pageNumber"
                        :class="{ active: pageNumber === categoryFundings.number + 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(pageNumber - 1)">{{ pageNumber }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: categoryFundings.last }">
                        <a class="page-link" href="#" @click.prevent="changePage(categoryFundings.number + 1)">다음</a>
                    </li>
                </ul>
            </nav> -->
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiWrapper from '../../util/axios/axios'
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'

const route = useRoute();
const router = useRouter();
const categoryFundings = ref({});
const noContentMessage = ref('');
const defaultImageUrl = ref(defaultThumbnail);
const pageSize = ref(20); // 페이지당 아이템 수

// const loadCategoryFundings = async (page = 0) => {
//     const { type, id } = route.params;
//     const categoryName = route.query.name;
//     try {
//         let response;
//         if (type === 'main') {
//             response = await apiWrapper.fetchFundingsByMainCategoryId(id, page, pageSize.value);
//         } else if (type === 'sub') {
//             response = await apiWrapper.fetchFundingsBySubCategoryId(id, page, pageSize.value);
//         }
//         if (response && response.content && response.content.length > 0) {
//             categoryFundings.value = response;
//             noContentMessage.value = '';
//         } else {
//             categoryFundings.value = { content: [], number: 0, totalPages: 0, first: true, last: true };
//             noContentMessage.value = `${categoryName} 카테고리의 펀딩 프로젝트가 존재하지 않습니다.`;
//         }
//     } catch (error) {
//         console.error('카테고리별 펀딩 조회 중 오류 발생:', error);
//         categoryFundings.value = { content: [], number: 0, totalPages: 0, first: true, last: true };
//         noContentMessage.value = '펀딩 프로젝트를 불러오는 중 오류가 발생했습니다.';
//     }
// };

const loadCategoryFundings = async () => {
    const { type, id } = route.params;
    const categoryName = route.query.name;
    try {
        let response;
        if (type === 'main') {
            response = await apiWrapper.fetchFundingsByMainCategoryId(id);
        } else if (type === 'sub') {
            response = await apiWrapper.fetchFundingsBySubCategoryId(id);
        }
        if (response && response.length > 0) {
            categoryFundings.value = response;
            noContentMessage.value = '';
        } else {
            categoryFundings.value = [];
            noContentMessage.value = `${categoryName} 카테고리의 펀딩 프로젝트가 존재하지 않습니다.`;
        }
    } catch (error) {
        console.error('카테고리별 펀딩 조회 중 오류 발생:', error);
        categoryFundings.value = [];
        noContentMessage.value = '펀딩 프로젝트를 불러오는 중 오류가 발생했습니다.';
    }
};

onMounted(() => {
    loadCategoryFundings();
});

watch(() => route.fullPath, () => loadCategoryFundings());

// const changePage = (newPage) => {
//     if (newPage >= 0 && newPage < categoryFundings.value.totalPages) {
//         loadCategoryFundings(newPage);
//     }
// };

// const displayedPages = computed(() => {
//     const currentPage = categoryFundings.value.number + 1;
//     const totalPages = categoryFundings.value.totalPages;
//     const range = 2; // 현재 페이지 양쪽에 표시할 페이지 수

//     let start = Math.max(currentPage - range, 1);
//     let end = Math.min(currentPage + range, totalPages);

//     if (end - start + 1 < range * 2 + 1) {
//         if (currentPage < totalPages / 2) {
//             end = Math.min(start + range * 2, totalPages);
//         } else {
//             start = Math.max(end - range * 2, 1);
//         }
//     }

//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
// });


// import { ref, onMounted, watch, computed } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
// import apiWrapper from '../../util/axios/axios'
// import defaultThumbnail from '../../assets/default_thumbnail.jpeg'

// const route = useRoute();
// const router = useRouter();
// const categoryFundings = ref([]);
// const noContentMessage = ref('');
// const defaultImageUrl = ref(defaultThumbnail);

// const loadCategoryFundings = async () => {
//     const { type, id } = route.params;
//     const categoryName = route.query.name;
//     try {
//         let response;
//         if (type === 'main') {
//             response = await apiWrapper.fetchFundingsByMainCategoryId(id);
//         } else if (type === 'sub') {
//             response = await apiWrapper.fetchFundingsBySubCategoryId(id);
//         }
//         if (response && response.length > 0) {
//             categoryFundings.value = response;
//             noContentMessage.value = '';
//         } else {
//             categoryFundings.value = [];
//             noContentMessage.value = `${categoryName} 카테고리의 펀딩 프로젝트가 존재하지 않습니다.`;
//         }
//     } catch (error) {
//         console.error('카테고리별 펀딩 조회 중 오류 발생:', error);
//         categoryFundings.value = [];
//         noContentMessage.value = '펀딩 프로젝트를 불러오는 중 오류가 발생했습니다.';
//     }
// };

// onMounted(() => {
//     loadCategoryFundings();
// });

// watch(() => route.fullPath, loadCategoryFundings);

const categoryTitle = computed(() => {
    return route.query.name ? `${route.query.name} ${route.params.type === 'main' ? '전체' : ''}` : '';
});

const getThumbnailUrl = (url) => {
    return url || defaultImageUrl.value;
};

const handleImageError = (event) => {
    event.target.src = defaultImageUrl.value;
};

const redirectToFundingDetail = (fundingId) => {
    router.push(`/funding/${fundingId}`);
};
</script>

<style scoped>
.col {
    padding: 5px;
}

#selected-category-title {
    font-weight: bold;
    font-size: 25px;
    text-align: left;
}

.card {
    padding: 0;
    overflow: hidden;
}

.card-body {
    padding: 3px;
    padding-right: 10px;
}

.card-title {
    font-size: 1rem;
    margin-top: 5px;
    margin-bottom: 0.5rem;
}

.card-text {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
}

.card-image {
    min-height: 150px;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media (max-width: 576px) {
    .card-body {
        padding: 0.25rem;
    }

    .card-title {
        font-size: 0.9rem;
    }

    .card-text {
        font-size: 0.7rem;
    }
}
</style>