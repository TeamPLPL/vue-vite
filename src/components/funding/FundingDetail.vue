<template>
    <div>
        <div class="thumbnail-container">
            <img :src="thumbnailUrlComputed"
            class="thumbnail-img object-fit-cover border rounded" 
            :alt="`${fundingTitle}의 썸네일`" @error="handleImageError">
        </div>
    </div>
    <div>
        {{ fundingExplanation }}
    </div>
    <div>
        <div v-for="(detailImg, index) in detailImgList" :key="index">
            <img :src="detailUrlComputed(detailImg)" :alt="`${fundingTitle}의 설명 이미지${index}`">
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import defaultImageUrl from '../../assets/default_thumbnail.jpeg';

const route = useRoute();
const fundingId = inject('fundingId');
const fundingTitle = inject('fundingTitle');
const fundingExplanation = inject('fundingExplanation');

const thumbnailUrl = ref();
const detailImgList = ref([]);

// 컴포넌트가 마운트될 때 데이터 호출
onMounted(async () => {
    try {
        const data = await apiWrapper.fetchFundingImgList(fundingId.value);
        thumbnailUrl.value = data.thumbnailImgUrl;
        detailImgList.value = data.detailImgUrlList;
    } catch (error) {
        console.error('이미지 데이터 로딩 중 오류 발생:', error);
    }
});

const thumbnailUrlComputed = computed(() => {
    return thumbnailUrl.value || defaultImageUrl;
});

const handleImageError = (event) => {
    event.target.src = defaultImageUrl.value
}

const detailUrlComputed = computed((url) => {
    return url || defaultImageUrl;
})

</script>

<style>
.thumbnail-img {
    max-width: 100%;
}
</style>