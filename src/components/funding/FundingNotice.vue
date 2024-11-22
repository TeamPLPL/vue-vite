<template>
    <div class="funding-notice">
        <div class="notice-header">
            <div class="title-wrapper">
                <h2 class="funding-notice-title">새소식&nbsp;&nbsp;<span class="total-count">{{ totalElements }}</span>
                </h2>

            </div>
            <button v-if="isCreator" @click="toggleWriteModal" class="write-button">
                글쓰기
            </button>
        </div>

        <div v-if="isLoading" class="loading">로딩 중...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="noticeList.length > 0">
            <div v-for="notice in noticeList" :key="notice.noticeId" class="notice-item">
                <div @click="showNoticeDetail(notice)">
                    <h3 class="notice-title">{{ notice.noticeTitle }}</h3>
                    <p class="notice-date">{{ formatDate(notice.noticeDate) }}</p>
                </div>
            </div>

            <nav aria-label="Page navigation" class="mt-4">
                <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 0 }">
                        <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">이전</a>
                    </li>
                    <li v-for="page in displayedPages" :key="page" class="page-item"
                        :class="{ active: page === currentPage + 1 }">
                        <a v-if="page !== '...'" class="page-link" href="#" @click.prevent="changePage(page - 1)">{{
                            page }}</a>
                        <span v-else class="page-link">{{ page }}</span>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
                        <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">다음</a>
                    </li>
                </ul>
            </nav>
        </div>
        <div v-else class="no-notices">
            <p>등록된 새소식이 없습니다.</p>
        </div>

        <!-- 글쓰기 모달 -->
        <div class="modal fade" id="writeModal" tabindex="-1" aria-labelledby="writeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="writeModalLabel">새 공지사항 작성</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitNotice">
                            <div class="mb-3 row align-items-center">
                                <label for="noticeTitle" class="col-sm-2 col-form-label">제목</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="noticeTitle" v-model="newNotice.title"
                                        required>
                                </div>
                            </div>
                            <div class="mb-3 row align-items-center">
                                <label for="noticeContent" class="col-sm-2 col-form-label">내용</label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" id="noticeContent" rows="5"
                                        v-model="newNotice.content" required></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                                <button type="submit" class="btn btn-primary">등록</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject, watch, computed, defineEmits } from 'vue';
import { Modal } from 'bootstrap';
import apiWrapper from '../../util/axios/axios';

const fundingId = inject('fundingId');
const formatDate = inject('formatDate', (date) => new Date(date).toLocaleDateString());
const isCreator = inject('isCreator', false);

const noticeList = ref([]);
const currentPage = ref(0);
const totalPages = ref(0);
const totalElements = ref(0);
const isLoading = ref(false);
const error = ref(null);
const writeModal = ref(null);
const newNotice = ref({ title: '', content: '' });
const pageSize = 5;

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
        totalElements.value = response.totalElements;
    } catch (err) {
        error.value = err.response?.data?.message || '새소식을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.';
        console.error('새소식을 불러오는 중 오류가 발생했습니다:', err);
    } finally {
        isLoading.value = false;
    }
};

const changePage = (page) => {
    if (page >= 0 && page < totalPages.value) {
        fetchNotices(page);
    }
};

const toggleWriteModal = () => {
    writeModal.value.toggle();
};

const submitNotice = async () => {
    try {
        await apiWrapper.createNewNotice(fundingId.value, newNotice.value);
        writeModal.value.hide();
        newNotice.value = { title: '', content: '' };
        await fetchNotices(0);
    } catch (error) {
        console.error('새 글 등록 중 오류 발생:', error);
        alert('새 글 등록 중 오류 발생\n다시 시도해주세요.');
    }
};

const displayedPages = computed(() => {
    const delta = 2;
    const range = [];
    const totalPageCount = totalPages.value;
    const currentPageNum = currentPage.value + 1;
    for (let i = 1; i <= totalPageCount; i++) {
        if (
            i === 1 || i === totalPageCount ||
            (i >= currentPageNum - delta && i <= currentPageNum + delta)
        ) {
            range.push(i);
        } else if (range[range.length - 1] !== '...') {
            range.push('...');
        }
    }
    return range;
});

watch(() => fundingId.value, () => {
    fetchNotices();
});

onMounted(() => {
    fetchNotices();
    writeModal.value = new Modal(document.getElementById('writeModal'));
});

const setSelectedNotice = inject('setSelectedNotice');
const emit = defineEmits(['showNoticeDetail']);

const showNoticeDetail = (notice) => {
    setSelectedNotice(notice); // 부모의 selectedNotice를 업데이트
    emit('showNoticeDetail', notice.noticeId); // 부모에 이벤트 전달
};
</script>

<style scoped>
.funding-notice {
    max-width: 1080px;
    margin: 0 auto;
    padding: 20px;
}

.notice-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.funding-notice-title {
    font-size: 18px;
    font-weight: 700;
    color: #333;
}

.write-button {
    padding: 8px 16px;
    background-color: #00c4c4;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.notice-item {
    padding: 24px 0;
    border-bottom: 1px solid #f0f0f0;
    text-align: left;
}

.notice-title {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-bottom: 8px;
    text-align: left;
}

.notice-date {
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
}

.notice-content {
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    text-align: left;
    white-space: pre-line;
}

.pagination {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    gap: 4px;
}

.page-item .page-link {
    padding: 6px 12px;
    color: #666;
    border: 1px solid #e9ecef;
    background-color: white;
    font-size: 14px;
}

.page-item.active .page-link {
    background-color: #00c4c4;
    border-color: #00c4c4;
    color: white;
    font-weight: 500;
}

.no-notices {
    text-align: center;
    padding: 48px 0;
    color: #999;
    font-size: 14px;
}

.loading,
.error {
    text-align: center;
    padding: 32px 0;
    color: #666;
    font-size: 14px;
}

/* 모달 스타일 추가 */
.modal-content {
    border-radius: 8px;
}

.modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
}

.modal-title {
    font-size: 16px;
    font-weight: 700;
}

.modal-body {
    padding: 24px;
}

.modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #eee;
}

.form-control {
    font-size: 14px;
    border: 1px solid #e9ecef;
    border-radius: 4px;
}

.form-control:focus {
    border-color: #00c4c4;
    box-shadow: none;
}

@media (max-width: 768px) {
    .funding-notice {
        padding: 16px;
    }

    .notice-header {
        margin-bottom: 12px;
    }

    .notice-item {
        padding: 16px 0;
    }

    .modal-dialog {
        margin: 16px;
    }
}
</style>