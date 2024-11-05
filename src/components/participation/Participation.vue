<template>
    <div class="participation-container">
        <h2 class="title">참여내역</h2>

        <!-- 필터 드롭다운 -->
        <div class="filter-dropdown">
            <select v-model="selectedFilter" @change="filterList">
                <option value="전체">전체</option>
                <option value="진행중">진행중</option>
                <option value="종료">종료</option>
            </select>
        </div>

        <!-- 참여 내역 리스트 -->
        <div v-for="item in filteredItems" :key="item.id" class="participation-item">
            <div class="item-left">
                <div class="item-header">
                    <span>{{ item.category }} > {{ item.subcategory }}</span>
                    <span class="date">{{ item.date }} 참여</span>
                </div>
                <span class="status">{{ item.status }}</span>
                <h3>{{ item.title }}</h3>
                <p class="byline">by {{ item.author }}</p>
                <div class="cancel-link">
                    <router-link :to="`/cancel/${item.id}`">결제 예약취소</router-link>
                    <router-link :to="`/participation/${item.id}`" class="details-link">상세보기 &gt;</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const selectedFilter = ref("전체");

// 샘플 데이터
const items = ref([
    {
        id: 1,
        category: "프로모션",
        subcategory: "패션 > 가방",
        status: "진행중",
        title: "[LOOPER] 공항에서 여권을 찾느라 가방을 뒤집는 당신을 위해",
        author: "주식회사 루피",
        date: "2024.10.28",
    },
    // 추가 데이터 항목이 필요할 경우 여기서 더 추가
]);

// 필터링된 항목을 계산
const filteredItems = ref(items.value);

function filterList() {
    if (selectedFilter.value === "전체") {
        filteredItems.value = items.value;
    } else {
        filteredItems.value = items.value.filter(item => item.status === selectedFilter.value);
    }
}
</script>

<style scoped>
.participation-container {
    width: 90%;
    padding: 20px;
    margin: 100px 5%;
    text-align: left;
    position: absolute;
    left: 0;
    top: 0;
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
    gap: 10px; /* 링크들 사이 간격 */
    width: 100%; /* 부모 요소의 너비를 가득 채움 */
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
    gap: 10px; /* 링크들 사이 간격 */
    width: 100%; /* 부모 요소의 너비를 가득 채움 */
}

.cancel-link a {
    color: #007bff;
    text-decoration: none;
}
</style>
