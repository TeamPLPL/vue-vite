<template>
    <div class="funding-notice">
        <div class="notice-header align-item-center">
            <h2 class="funding-notice-title">새소식</h2>
            <button v-if="isCreator" @click="goToWritePage" class="write-button">
                글쓰기
            </button>
        </div>
        <div v-if="isLoading" class="loading">로딩 중...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="noticeList?.length > 0">
            <div v-for="notice in noticeList" :key="notice.noticeId" class="notice-item">
                <h3>{{ notice.noticeTitle }}</h3>
                <p class="notice-date">{{ formatDate(notice.noticeDate) }}</p>
                <div class="notice-content">{{ notice.noticeContent }}</div>
            </div>
            <div class="pagination">
                <button @click="fetchNotices(currentPage - 1)" :disabled="currentPage === 0"
                    aria-label="이전 페이지">이전</button>
                <input type="number" v-model="inputPage" @change="goToPage" :min="1" :max="totalPages"
                    aria-label="페이지 번호 입력">
                <span> / {{ totalPages }}</span>
                <button @click="fetchNotices(currentPage + 1)" :disabled="currentPage === totalPages - 1"
                    aria-label="다음 페이지">다음</button>
            </div>
        </div>
        <div v-else class="no-notices">
            <p>등록된 새소식이 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue';
import apiWrapper from '../../util/axios/axios';

const fundingId = inject('fundingId');
const noticeList = ref([]);
const formatDate = inject('formatDate', (date) => new Date(date).toLocaleDateString());
const currentPage = ref(0);
const totalPages = ref(0);
const pageSize = 10;
const isLoading = ref(false);
const error = ref(null);
const inputPage = ref(1);

const fetchNotices = async (page = 0) => {
    if (!fundingId || !fundingId.value) {
        error.value = "유효하지 않은 펀딩 ID입니다.";
        return;
    }

    isLoading.value = true;
    error.value = null;
    try {
        const response = await apiWrapper.getNoticeList(fundingId.value, page, pageSize);
        noticeList.value = response.content || [];
        currentPage.value = response.number;
        totalPages.value = response.totalPages;
        inputPage.value = response.number + 1;
    } catch (err) {
        error.value = err.response?.data?.message || '새소식을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.';
        console.error('새소식을 불러오는 중 오류가 발생했습니다:', err);
    } finally {
        isLoading.value = false;
    }
};

const goToPage = () => {
    const page = Number(inputPage.value) - 1;
    if (!isNaN(page) && page >= 0 && page < totalPages.value) {
        fetchNotices(page);
    } else {
        inputPage.value = currentPage.value + 1;
    }
};

watch(() => fundingId.value, () => {
    fetchNotices();
});

onMounted(() => {
    fetchNotices();
});

/////////// 작성자에게만 글쓰기 버튼 허용
const isCreator = inject('isCreator', false);
const goToWritePage = () => {
    router.push(`/funding/${fundingId.value}/notice/write`);
};

</script>


<style scoped>
.notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
}

.funding-notice-title {
    margin: 0;
    text-align: left;
    font-size: x-large;
    font-weight: bold;
}

.write-button {
    padding: 8px 16px;
    background-color: #00c4c4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.write-button:hover {
    background-color: #00b4b4;
}

.funding-notice {
    padding: 20px;
}

.notice-item {
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
}

.notice-date {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 10px;
}

.notice-content {
    line-height: 1.6;
}

.no-notices {
    text-align: center;
    color: #666;
    padding: 20px 0;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 10px;
}

.loading,
.error {
    text-align: center;
    padding: 20px;
}

.error {
    color: red;
}

.pagination input {
    width: 50px;
    text-align: center;
    margin: 0 10px;
}
</style>