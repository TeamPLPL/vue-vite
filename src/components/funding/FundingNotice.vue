<template>
    <div class="funding-notice">
        <h2>새소식</h2>
        <div v-if="notices.length > 0">
            <div v-for="notice in notices" :key="notice.id" class="notice-item">
                <h3>{{ notice.title }}</h3>
                <p class="notice-date">{{ formatDate(notice.createdAt) }}</p>
                <div class="notice-content" v-html="notice.content"></div>
            </div>
        </div>
        <div v-else class="no-notices">
            <p>등록된 새소식이 없습니다.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';

const fundingId = inject('fundingId')
const notices = ref([]);
const formatDate = inject('formatDate');

const fetchNotices = async () => {
    try {
        // API 호출을 통해 새소식 데이터를 가져오는 로직 구현
        // notices.value = await 새소식 데이터 가져오기
    } catch (error) {
        console.error('새소식을 불러오는 중 오류가 발생했습니다:', error);
    }
};

onMounted(() => {
    fetchNotices();
});
</script>

<style scoped>
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
</style>