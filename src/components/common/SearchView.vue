<template>
    <div class="search-page">
        <h1>검색 결과: {{ $route.query.q }}</h1>
        <div v-if="loading">로딩 중...</div>
        <div v-else-if="error">에러 발생: {{ error }}</div>
        <div v-else-if="fundingList.length === 0">검색 결과가 없습니다.</div>
        <div v-else>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                <div class="col" v-for="funding in fundingList" :key="funding.id">
                    <div class="card h-100" @click="redirectToFundingDetail(funding.id)">
                        <img :src="getThumbnailUrl(funding.thumbnailImgUrl)" class="card-img-top"
                            :alt="funding.fundingTitle" @error="handleImageError">
                        <div class="card-body">
                            <h5 class="card-title">{{ funding.fundingTitle }}</h5>
                            <p class="card-text">작성자: {{ funding.makerNick }}</p>
                            <p class="card-text">달성률: {{ funding.achievementRate }}%</p>
                            <p class="card-text">후원자 수: {{ funding.supportCnt }}</p>
                            <p class="card-text">찜 수: {{ funding.wishlistCnt }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <nav aria-label="Page navigation" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
                    </li>
                    <li class="page-item" v-for="page in displayedPages" :key="page"
                        :class="{ active: page === currentPage }">
                        <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'

const defaultImageUrl = ref(defaultThumbnail);

const getThumbnailUrl = (url) => {
    return url || defaultImageUrl.value;
};

const handleImageError = (event) => {
    event.target.src = defaultImageUrl.value;
};

const redirectToFundingDetail = (fundingId) => {
    router.push(`/funding/${fundingId}`);
};

const route = useRoute();
const router = useRouter();

const fundingList = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);

const title = ref(route.query.q || '');
const size = 20; // 페이지 당 항목 수

const fetchSearchResults = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await apiWrapper.getSearchResult(title.value, currentPage.value - 1, size);
        console.log('API Response:', response);

        if (response && response.data) {
            fundingList.value = response.data.content || [];
            totalPages.value = response.data.totalPages || 1;
            currentPage.value = (response.data.number || 0) + 1;
        } else {
            throw new Error('Invalid API response');
        }
    } catch (err) {
        console.error('API Error:', err);
        error.value = '검색 결과를 불러오는 데 실패했습니다: ' + err.message;
    } finally {
        loading.value = false;
    }
};

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        router.push({ query: { ...route.query, page } });
    }
};

const displayedPages = computed(() => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, currentPage.value - delta);
        i <= Math.min(totalPages.value, currentPage.value + delta);
        i++) {
        range.push(i);
    }
    return range;
});

// const redirectToFundingDetail = (id) => {
//     router.push({ name: 'FundingDetail', params: { id } });
// };

// const getThumbnailUrl = (url) => {
//     // 이미지 URL 처리 로직
//     return url || 'default-image-url';
// };

// const handleImageError = (event) => {
//     event.target.src = 'path-to-fallback-image';
// };

onMounted(() => {
    fetchSearchResults();
});

watch(() => route.query, () => {
    currentPage.value = parseInt(route.query.page) || 1;
    title.value = route.query.q || '';
    fetchSearchResults();
}, { deep: true });
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