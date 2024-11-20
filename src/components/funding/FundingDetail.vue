<template>
    <div>
        <div class="thumbnail-container">
            <img :src="thumbnailUrlComputed" class="thumbnail-img object-fit-cover border rounded"
                :alt="`${fundingTitle}의 썸네일`" @error="handleImageError">
        </div>
    </div>
    <div class="expl-container">
        {{ fundingExplanation }}
    </div>
    <div>
        <!-- <div v-for="(detailImg, index) in detailImgList" :key="index">
            <img :src="detailUrlComputed(detailImg)" :alt="`${fundingTitle}의 설명 이미지${index}`">
        </div> -->
        <div class="detail-img-container d-flex flex-column">
            <img :src="detailImgUrlComputed" class="detail-img img-fluid" :alt="`${fundingTitle}의 설명 이미지`"
                @error="handleImageError">
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import defaultImageUrl from '../../assets/default_thumbnail.jpeg';

const props = defineProps({
    fundingId: {
        type: [String, Number], // fundingId가 문자열이나 숫자일 수 있으므로
        required: true
    }
});

const route = useRoute();

const fundingTitle = inject('fundingTitle');
const fundingExplanation = inject('fundingExplanation');

const thumbnailUrl = ref();
// const detailImgList = ref([]);
const detailImgUrl = ref();

// 컴포넌트가 마운트될 때 데이터 호출
onMounted(async () => {
    try {

        const data = await apiWrapper.fetchFundingImgList(props.fundingId);
        thumbnailUrl.value = data.thumbnailImgUrl;
        detailImgUrl.value = data.detailImgUrl;
        // detailImgList.value = data.detailImgUrlList;
    } catch (error) {
        console.error('이미지 데이터 로딩 중 오류 발생:', error);
    }
});

const thumbnailUrlComputed = computed(() => {
    return thumbnailUrl.value || defaultImageUrl;
});

const detailImgUrlComputed = computed(() => {
    return detailImgUrl.value || defaultImageUrl;
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

.expl-container {
    width: 100%;
    margin-top: 70px;
    margin-bottom: 20px;
    padding-left: 5px;
    text-align: left;
}

.detail-img-container {
    max-width: 100%;
    overflow-y: auto;
}

.detail-img {
    max-width: 100%;
    height: auto;
    object-fit: contain;
}
</style>