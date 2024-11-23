<template>
    <div class="funding-board">
        <div class="board-header">
            <div class="title-wrapper">
                <h2 class="funding-board-title">서포터 게시판&nbsp;&nbsp;<span class="total-count">{{ boards.length }}</span>
                </h2>
            </div>
            <button @click="openModal" class="write-button">글쓰기</button>
        </div>

        <div v-if="isLoading" class="loading">로딩 중...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="boards.length > 0">
            <div v-for="board in boards" :key="board.id" class="board-item">
                <div class="board-header-row">
                    <div class="user-info">
                        <img src="../../assets/default_profile.png" class="profile-image" />
                        <div class="flex row ms-2">
                            <span class="username">{{ board.userNick || '익명' }}</span>
                            <span class="timestamp">{{ formatDate(board.boardDate) }}</span>
                        </div>
                    </div>
                    <div class="menu-container">
                        <button @click="toggleMenu(board.id)" class="menu-button">⋮</button>
                        <div v-if="isMenuOpen(board.id)" class="menu-dropdown">
                            <button @click="confirmDelete(board.id)">삭제</button>
                        </div>
                    </div>
                </div>
                <p class="board-body">{{ board.boardContent }}</p>
            </div>
        </div>
        <div v-else class="no-boards">
            <p>등록된 게시글이 없습니다.</p>
        </div>

        <!-- 글쓰기 모달 -->
        <teleport to="html">
            <div v-if="showModal" class="modal-overlay">
                <div class="modal-content">
                    <h4>의견</h4>
                    <textarea v-model="newBoardContent" placeholder="프로젝트에 대한 의견을 남겨주세요" rows="5"></textarea>
                    <div class="modal-footer">
                        <button @click="closeModal">취소</button>
                        <button @click="submitBoard">등록하기</button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import apiWrapper from '../../util/axios/axios';

const route = useRoute();
const fundingId = ref(route.params.id);
const boards = ref([]);
const openMenuId = ref(null);
const showModal = ref(false);
const newBoardContent = ref('');
const isLoading = ref(false);
const error = ref(null);

const openModal = () => (showModal.value = true);
const closeModal = () => (showModal.value = false);

const fetchBoards = async () => {
    isLoading.value = true;
    try {
        const data = await apiWrapper.getData(`/api/supporter-boards/funding/${fundingId.value}`);
        boards.value = data;
    } catch (err) {
        error.value = '게시글을 불러오는 중 오류가 발생했습니다.';
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ko-KR');

const toggleMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id;
};

const isMenuOpen = (id) => openMenuId.value === id;

const confirmDelete = (id) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) deleteBoard(id);
};

const deleteBoard = async (id) => {
    try {
        await apiWrapper.deleteData(`/api/supporter-boards/${id}`);
        boards.value = boards.value.filter((board) => board.id !== id);
        alert('게시글이 삭제되었습니다.');
    } catch {
        alert('게시글 삭제 중 오류가 발생했습니다.');
    }
};

const submitBoard = async () => {
    if (newBoardContent.value.length < 10) {
        alert('내용은 최소 10자 이상 입력해주세요.');
        return;
    }
    try {
        await apiWrapper.postData(`/api/supporter-boards/${fundingId.value}`, {
            boardContent: newBoardContent.value,
        });
        newBoardContent.value = '';
        closeModal();
        fetchBoards();
    } catch (error) {
        if (error.response && error.response.status === 403) {
            // 서버에서 Forbidden 상태 반환 시 경고 메시지
            alert('펀딩에 참여하지 않은 사용자는 게시글을 작성할 수 없습니다.');
        } else {
            alert('게시글 등록 중 오류가 발생했습니다.');
        }
    }
};

onMounted(fetchBoards);
</script>

<style scoped>
.funding-board {
    max-width: 1080px;
    margin: 0 auto;
    padding: 20px;
}

.board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    border-bottom: 1px solid #eee;
}

.funding-board-title {
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

.write-button:hover {
    background-color: #00a1a1;
}

.board-item {
    padding: 24px 0;
    border-bottom: 1px solid #f0f0f0;
    text-align: left;
}

.board-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.user-info {
    display: flex;
    align-items: center;
}

.profile-image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.username {
    font-weight: 700;
}

.timestamp {
    font-size: 12px;
    color: #999;
}

.board-body {
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    white-space: pre-line;
}

.menu-container {
    position: relative;
}

.menu-button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
}

.menu-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    display: flex;
    gap: 10px;
    /* 버튼 사이 간격 추가 */
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 5px;
    transform: translateY(-50%);
    z-index: 10;
}

.menu-dropdown button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    padding: 5px 10px;
    color: #333;
}

.menu-dropdown button:hover {
    background-color: #f0f0f0;
}

.loading,
.error {
    text-align: center;
    padding: 32px 0;
    color: #666;
}

.no-boards {
    text-align: center;
    padding: 48px 0;
    color: #999;
    font-size: 14px;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
}

.modal-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>