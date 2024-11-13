<template>
    <div class="top-bar">
        <RouterLink :to="`/funding/detail/${id}`">
            < 스토리로 돌아가기 </RouterLink>
                <h6>Looper 공항에서 여권을 찾느라 가방을 뒤집는 당신을 위해</h6>
    </div>
    <div class="complete-payment-container">
        <!-- 참여 완료 메시지 -->
        <h2 class="text-start">참여 완료 🎉</h2>
        <div class="completion-message text-center my-5">
            <h5 class="delivery-info text-start">- 배송 예정일 2024.11 중순 (11~20일)</h5>

            <!-- 프로젝트 소개 섹션 -->
            <div class="project-info">
                <p class="fw-bold">나만 알고 있기 아까운 프로젝트라면?</p>
                <p>친구에게 소개하고 | 포인트를 받아보세요</p>
            </div>
            <RouterLink to="/participation">
                <button class="next-button">다음</button>
            </RouterLink>
            
        </div>

        <!-- 주식회사 루피 정보 -->
        <div class="company-info d-flex justify-content-between">
            <div class="text-start d-flex">
                <img src="#">
                <div>
                    주식회사 루피<br>메이커 소식을 받아보고 싶다면?
                </div>
                
            </div>
            <button class="follow-button">팔로우</button>
        </div>

        <!-- 놀랄 수 없는 이벤트 섹션 -->
        <div class="event-section my-4">
            <h5>놓칠 수 없는 이벤트</h5>
            <div class="event-image">
                <img src="../../assets/event-placeholder.png" />
            </div>
            <p>나다운 성장, 원 포인트 레벨업!</p>
        </div>

        <!-- 추천 프로젝트 섹션 -->
        <div class="project-recommendation">
            <h5>내 취향에 맞는 프로젝트</h5>
            <div class="project-grid">
                <div v-for="n in 4" :key="n" class="project-card">
                    <img src="../../assets/project-placeholder.png" alt="프로젝트 이미지" />
                    <p>프로젝트 제목 {{ n }}</p>
                </div>
            </div>
        </div>

        <!-- 관심 갈 만한 프로젝트 섹션 -->
        <div class="project-interest">
            <h5>관심 갈 만한 프로젝트</h5>
            <div class="project-grid">
                <div v-for="n in 4" :key="n" class="project-card">
                    <img src="../../assets/project-placeholder.png" alt="프로젝트 이미지" />
                    <p>프로젝트 제목 {{ n }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentStore } from '../../util/store/paymentStore';

defineProps(['id']); // id를 명시적으로 props로 정의

const router = useRouter();
const paymentStore = usePaymentStore();

onMounted(() => {
    // 결제 성공 상태 확인
    if (paymentStore.isPaymentSuccessful) {
        // 상태 초기화
        paymentStore.resetPaymentStatus();
    }
});
</script>

<style scoped>
.top-bar {
    display: flex;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
}

.complete-payment-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.completion-message {
    margin-bottom: 30px;
}

.delivery-info {
    padding: 3%;
    background-color: #e9ecef;
    margin-top: 10px;
    color: #666;
}

.next-button {
    background-color: #00c3bd;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    margin-top: 20px;
    cursor: pointer;
    width: 100%;
}

.project-info {
    padding: 15px;
    margin-top: 30px;
    border-radius: 5px;
    text-align: center;
}

.company-info {
    background-color: #fff;
    padding: 20px;
    margin-top: 20px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.follow-button {
    background-color: white;
    color: #00c3bd;
    padding: 10px;
    border: #00c3bd 1px solid;
    border-radius: 5px;
    cursor: pointer;
}

.event-section {
    margin-top: 40px;
}

.event-image img {
    width: 100%;
    height: auto;
    border-radius: 5px;
    margin-top: 10px;
}

.project-recommendation,
.project-interest {
    margin-top: 40px;
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
}

.project-card {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 15px;
    text-align: center;
}

.project-card img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}
</style>
