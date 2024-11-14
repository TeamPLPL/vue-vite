<template>
    <div>
        <div id="thumbnail-container">
            <img src="" alt="">
        </div>
    </div>
    <div>
        프로젝트 소개
    </div>
    <p>{{ message }}</p>
</template>

<script setup>
    import { ref, inject, onMounted } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios'

    const route = useRoute();
    const fundingId = inject('fundingId');

    const fundingDetail = ref({
        title: '',
        description: '',
        thumbnailUrl: ''
    });

    // API 호출 함수
    const fetchFundingDetail = async () => {
        // try {
        //     const response = await axios.get('/api/funding/1'); // 여기에 실제 API 경로 사용
        //     fundingDetail.value = response.data;  // 응답 데이터로 fundingData 업데이트
        //     isLoading.value = false;  // 로딩 완료
        // } catch (error) {
        //     errorMessage.value = 'Failed to fetch funding data';  // 오류 처리
        //     isLoading.value = false;  // 로딩 완료
        // }
    };

    // 컴포넌트가 마운트될 때 데이터 호출
    onMounted(() => {
        fetchFundingDetail();
    });

</script>

<style>

</style>