<template>
    <div class="participation-container">
        <h2 class="title">펀딩 참여내역</h2>

        <!-- 필터 드롭다운 -->
        <div class="filter-dropdown">
            <select v-model="selectedFilter" @change="filterList">
                <option value="전체">전체</option>
                <option value="진행중">진행중</option>
                <option value="종료">종료</option>
            </select>
        </div>

        <!-- 참여 내역 리스트 -->
        <!-- <div v-for="item in filteredItems" :key="item.id" class="participation-item">
            <div class="item-left">
                <div class="item-header">
                    <span>{{ item.category }} > {{ item.subcategory }}</span>
                    <span class="date">{{ item.date }} 참여</span>
                </div>
                <span class="status">{{ item.status }}</span>
                <h3>{{ item.title }}</h3>
                <p class="byline">by {{ item.author }}</p>
                <div class="cancel-link">
                    <button @click="showCancelModal = true" class="change-button">결제 예약 취소</button>
                    <router-link :to="`/mywadiz/supporter/participation/${item.id}`" class="details-link">상세보기 &gt;</router-link>
                </div>
            </div>
        </div> -->
        <div v-for="item in filteredItems" :key="item.id" class="participation-item">
            <div class="item-left">
                <div class="item-header">
                    <span>{{ item.category }} > {{ item.subcategory }}</span>
                    <span class="date">{{ item.date }} 참여</span>
                </div>
                <span class="status">{{ getStatus(item) }}</span>
                <h3>{{ item.title }}</h3>
                <p class="byline">by {{ item.author }}</p>
                <div class="cancel-link">
                    <button @click="showCancelModal = true" class="change-button">결제 예약 취소</button>
                    <router-link :to="`/mywadiz/supporter/participation/${item.id}`" class="details-link">상세보기 &gt;</router-link>
                </div>
            </div>
        </div>

        <!-- 모달 컴포넌트 -->
        <ModalConfirm 
            v-show="showCancelModal" 
            :show="showCancelModal" 
            title="결제를 취소하시겠어요?"
            message="리워드 옵션 변경을 원한다면 결제를 취소하지 않고 참여 내역에서 변경 가능해요." 
            @close="closeCancelModal"
            @confirm="cancelReservation"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ModalConfirm from './participationComponents/ModalConfirm.vue';
import apiWrapper from '../../util/axios/axios';
import { useAuthStore } from '../../util/store/authStore';

const authStore = useAuthStore();
const selectedFilter = ref("전체");
const showCancelModal = ref(false);
const selectedItem = ref(null); // 선택된 항목
const router = useRouter();

// const items = ref([
//     {
//         id: 1,
//         category: "프로모션",
//         subcategory: "패션 > 가방",
//         status: "진행중",
//         title: "[LOOPER] 공항에서 여권을 찾느라 가방을 뒤집는 당신을 위해",
//         author: "주식회사 루피",
//         date: "2024.10.28",
//     },
// ]);

// const filteredItems = ref(items.value);

const items = ref([]); // 참여 내역
const filteredItems = ref([]); // 필터링된 항목

// 참여한 펀딩의 상태를 나타내준다.
function getStatus(item) {
    const now = new Date();
    const fundingStartDate = new Date(item.fundingStartDate);
    const fundingEndDate = new Date(item.fundingEndDate);

    if (now >= fundingStartDate && now <= fundingEndDate) {
        return '진행중';
    } else if (now > fundingEndDate) {
        if (item.currentAmount >= item.targetAmount) {
            return '완료';
        } else {
            return '프로젝트 실패';
        }
    } else {
        return '해당없음';
    }
}

function openCancelModal(item) {
    selectedItem.value = item;
    showCancelModal.value = true;
}

function closeCancelModal() {
    showCancelModal.value = false;
    selectedItem.value = null;
}

function cancelReservation() {
    if (selectedItem.value) {
        console.log(`결제 예약 취소됨: ${selectedItem.value.title}`);
        // 취소 처리 로직 추가
    }
    closeCancelModal();
}

function filterList() {
    if (selectedFilter.value === "전체") {
        filteredItems.value = items.value;
    } else {
        filteredItems.value = items.value.filter(item => item.status === selectedFilter.value);
    }
}

// API 호출로 참여 내역 가져오기
async function fetchParticipationHistory() {
    try {
        const response = await apiWrapper.getData('/api/payment-history/user');
        items.value = response; // 서버에서 받은 참여 내역 저장
        filteredItems.value = items.value; // 필터링 초기화
        console.log('참여 내역:', items.value);
    } catch (error) {
        console.error('참여 내역 조회 실패:', error);
    }
}

// 컴포넌트가 마운트되면 참여 내역을 가져옴
onMounted(() => {
    const token = authStore.getJwtToken();

    if (!token) {
        console.warn('JWT 토큰이 없습니다.');
        router.push('/login');
        return;
    }
    fetchParticipationHistory();
});
</script>

<style scoped>
.participation-container {
    width: 100%;
    margin: 0;
    text-align: start;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: left;
}

.filter-dropdown {
    margin-bottom: 20px;
}

.participation-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    /* 링크들 사이 간격 */
    width: 100%;
    /* 부모 요소의 너비를 가득 채움 */
}

.item-left {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.status {
    color: #007bff;
    font-weight: bold;
    margin-bottom: 5px;
}

h3 {
    font-size: 18px;
    margin: 5px 0;
}

.byline {
    font-size: 14px;
    color: #888;
}

.date {
    font-size: 14px;
    color: #888;
    margin-bottom: 5px;
}

.details-link {
    color: #333;
    text-decoration: none;
}

.cancel-link {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    /* 링크들 사이 간격 */
    width: 100%;
    /* 부모 요소의 너비를 가득 채움 */
}

.cancel-link a {
    color: #007bff;
    text-decoration: none;
}
</style>
