<template>
    <div class="notice-detail-container">
        <!-- 공지사항 상세 정보 -->
        <div v-if="selectedNotice && selectedNotice.noticeTitle">
            <div class="notice-header">
                <h2 class="notice-title">{{ selectedNotice.noticeTitle }}</h2>
                <div class="notice-meta">
                    <span class="notice-date">{{ formatDate(selectedNotice.noticeDate) }}</span>
                </div>
            </div>
            <div class="notice-content">
                {{ selectedNotice.noticeContent }}
            </div>
            <div class="notice-actions">
                <button class="back-button" @click="goBack">목록보기</button>
                <div v-if="isCreator" class="maker-button-container">
                    <button class="update-button" @click="toggleWriteModal">
                        수정
                    </button>
                    <button class="delete-button" @click="deleteNotice">
                        삭제
                    </button>
                </div>
            </div>
        </div>

        <!-- 공지사항 데이터가 없을 때 -->
        <div v-else>
            <p>공지사항을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.</p>
        </div>

        <!-- 수정 모달 -->
        <div class="modal fade" id="writeModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">공지사항 수정</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="updateNotice">
                            <div class="mb-3 row">
                                <label for="noticeTitle" class="col-sm-2 col-form-label">제목</label>
                                <div class="col-sm-10">
                                    <input type="text" id="noticeTitle" class="form-control"
                                        v-model="editingNotice.noticeTitle" required />
                                </div>
                            </div>
                            <div class="mb-3 row">
                                <label for="noticeContent" class="col-sm-2 col-form-label">내용</label>
                                <div class="col-sm-10">
                                    <textarea id="noticeContent" class="form-control" rows="5"
                                        v-model="editingNotice.noticeContent" required></textarea>
                                </div>
                            </div>
                            <div class="modal-footer px-0">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                                <button type="submit" class="btn btn-primary">수정</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import { Modal } from 'bootstrap';

const route = useRoute();
const router = useRouter();
const fundingId = inject('fundingId');
const isCreator = inject('isCreator', false);

const writeModal = ref(null);
const selectedNotice = ref({});
const editingNotice = ref({});
const formatDate = inject('formatDate', (date) => new Date(date).toLocaleDateString());

onMounted(async () => {
    const noticeId = route.query.noticeId;
    if (noticeId) {
        await fetchNoticeDetails(noticeId);
    }

    writeModal.value = new Modal(document.getElementById('writeModal'));
});

const fetchNoticeDetails = async (noticeId) => {
    try {
        const response = await apiWrapper.getNoticeDetail(fundingId.value, noticeId);
        if (!response || !response.noticeTitle) {
            console.error('공지사항 데이터가 유효하지 않습니다:', response);
            return;
        }
        selectedNotice.value = response;
    } catch (error) {
        console.error('공지사항 상세 정보를 불러오는 중 오류 발생:', error);
        alert('공지사항을 불러오는 데 실패했습니다.');
    }
};

const goBack = () => {
    router.push({ name: 'FundingNotice', params: { id: fundingId.value } });
};

const toggleWriteModal = () => {
    if (selectedNotice.value.noticeTitle) {
        editingNotice.value = { ...selectedNotice.value };
        writeModal.value.toggle();
    } else {
        console.error('수정할 데이터가 없습니다.');
    }
};

const updateNotice = async () => {
    try {
        await apiWrapper.updateNotice(fundingId.value, editingNotice.value);
        writeModal.value.hide();
        await fetchNoticeDetails(selectedNotice.value.noticeId);
    } catch (error) {
        console.error('공지사항 수정 중 오류 발생:', error);
        alert('공지사항 수정 중 오류 발생. 다시 시도해주세요.');
    }
};

const deleteNotice = async () => {
    if (confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
        try {
            await apiWrapper.deleteNotice(fundingId.value, selectedNotice.value.noticeId);
            router.push({ name: 'FundingNotice', params: { id: fundingId.value } });
        } catch (error) {
            console.error('공지사항 삭제 중 오류 발생:', error);
            alert('공지사항 삭제 중 오류 발생. 다시 시도해주세요.');
        }
    }
};

</script>

<style scoped>
.notice-detail-container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 20px;
}

.notice-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.notice-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin-bottom: 12px;
    text-align: left;
}

.notice-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notice-date {
    color: #666;
    font-size: 14px;
}

.action-button {
    padding: 6px 12px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
}

.notice-content {
    min-height: 200px;
    line-height: 1.6;
    color: #333;
    font-size: 16px;
    margin-bottom: 40px;
    white-space: pre-line;
    text-align: left;
}

.notice-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.maker-button-container {
    display: flex;
    gap: 10px;
}

.update-button,
.delete-button {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    color: #666;
}

.update-button:hover,
.delete-button:hover {
    background-color: #f5f5f5;
}

.update-count,
.delete-count {
    margin-left: 4px;
}

.back-button {
    padding: 8px 20px;
    background-color: #00c4c4;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.back-button:hover {
    background-color: #00b4b4;
}

@media (max-width: 768px) {
    .notice-detail-container {
        padding: 16px;
    }

    .notice-title {
        font-size: 20px;
    }

    .notice-content {
        font-size: 14px;
    }

    .modal-dialog {
        margin: 16px;
    }
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
</style>