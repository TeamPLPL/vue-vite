<template>
    <div class="comment-container">
        <div class="d-flex justify-content-between">
            <h4>서포터 게시판</h4>
            <button @click="openModal">글쓰기</button>
        </div>
        <hr />
        <div v-for="board in boards" :key="board.id" class="comment-box">
            <div class="comment-header">
                <div class="user-info">
                    <img src="../../assets/default_profile.png" class="profile-image">
                    <div class="flex row ms-2">
                        <span class="username text-start">{{ board.userNick || '익명' }}</span>
                        <span class="timestamp text-start">{{ formatDate(board.boardDate) }}</span>
                    </div>

                </div>
                <button class="follow-btn">+ 팔로우</button>
                <div class="menu-container">
                    <button @click="toggleMenu(board.id)" class="menu-button">
                        ⋮
                    </button>
                    <div v-if="isMenuOpen(board.id)" class="menu-dropdown">
                        <button @click="confirmDelete(board.id)">삭제</button>
                    </div>
                </div>
            </div>
            <hr />
            <div class="comment-body">
                <p>{{ board.boardContent }}</p>
            </div>
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

// Route parameter (Funding ID)
const route = useRoute();
const fundingId = ref(route.params.id);
const boards = ref([]);
const openMenuId = ref(null); // 현재 열려 있는 메뉴 ID
const showModal = ref(false); // 모달 표시 여부 관리
const newBoardContent = ref(''); // 새 글 내용

// Modal 열기와 닫기
const openModal = () => {
    showModal.value = true;
};
const closeModal = () => {
    showModal.value = false;
};

// Fetch boards data
const fetchBoards = async () => {
    try {
        const data = await apiWrapper.getData(`/api/supporter-boards/funding/${fundingId.value}`);
        boards.value = data;
        console.log(boards.value);
    } catch (error) {
        console.error('Error fetching supporter boards:', error);
    }
};

// Format date
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
};

// Toggle menu
const toggleMenu = (id) => {
    openMenuId.value = openMenuId.value === id ? null : id;
};

// Check if the menu is open
const isMenuOpen = (id) => {
    return openMenuId.value === id;
};

// Confirm delete and delete board
const confirmDelete = (id) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
        deleteBoard(id);
    }
};

// Delete board
const deleteBoard = async (id) => {
    try {
        await apiWrapper.deleteData(`/api/supporter-boards/${id}`);
        boards.value = boards.value.filter((board) => board.id !== id);
        alert('게시글이 삭제되었습니다.');
    } catch (error) {
        console.error('Error deleting board:', error);
        alert('게시글 삭제 중 오류가 발생했습니다.');
    }
};

// Submit new board
const submitBoard = async () => {
    if (newBoardContent.value.length < 10) {
        alert('내용은 최소 10자 이상 입력해주세요.');
        return;
    }

    try {
        await apiWrapper.postData(`/api/supporter-boards/${fundingId.value}`, {
            boardContent: newBoardContent.value,
        });
        alert('게시글이 등록되었습니다.');
        newBoardContent.value = ''; // 입력 필드 초기화
        closeModal(); // 모달 닫기
        fetchBoards(); // 게시판 새로고침
    } catch (error) {
        console.error('Error submitting board:', error);
        alert('게시글 등록 중 오류가 발생했습니다.');
    }
};

onMounted(() => {
    fetchBoards();
});
</script>

<style scoped>
.comment-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 10px;
}

.profile-image {
    height: 8%;
    width: 8%;
}

.comment-box {
    background: #fef9f4;
    /* 배경색 */
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 5px;
}

.comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.user-info {
    display: flex;
    font-weight: bold;
}

.username {
    margin-right: 10px;
}

.timestamp {
    font-size: 0.9em;
    color: #999;
}

.actions {
    display: flex;
    align-items: center;
}

.follow-btn {
    background-color: #ffffff;
    border: 1px solid #00b2b2;
    padding: 5px 10px;
    border-radius: 5px;
    font-size: 0.9em;
    color: #00b2b2;
    cursor: pointer;
    width: 25%;
}

.follow-btn:hover {
    background-color: #00b2b2;
    color: white;
}

.menu-container {
    margin: 10px;
    position: relative;
}

.menu-button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
    padding: 0;
    margin: 0;
}

.menu-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    padding: 5px 10px;
    z-index: 10;
}

.menu-dropdown button {
    background: none;
    border: none;
    padding: 5px 0;
    cursor: pointer;
    width: 100%;
    text-align: left;
}

.menu-dropdown button:hover {
    background-color: #f0f0f0;
}

.comment-body {
    font-size: 1em;
    line-height: 1.6;
    text-align: start;
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
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
}
</style>