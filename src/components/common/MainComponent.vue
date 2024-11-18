<template>
    <div class="container-lg row">
        <div class="col-lg-8">
            <div id="promo-container">
                <img id="promo-img" src="../../assets/promotion_default_img.jpeg" alt="">
            </div>
            <div id="new-funding-list">
                <h2 id="new-funding-title">최신 프로젝트</h2>
                <div id="new-cards" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 ps-3">
                    <div class="col" v-for="(funding, index) in newFundingList" :key="index"
                        @click="redirectToFundingDetail(funding.id)">

                        <div class="card mb-3">
                            <div class="row row-cols-xs-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 g-0">
                                <div class="col-6">
                                    <img :src="getThumbnailUrl(funding.thumbnailImgUrl)"
                                        class="img-fluid rounded-start object-fit-cover card-image"
                                        :alt="funding.fundingTitle" @error="handleImageError">
                                </div>
                                <div class="col-6">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ funding.fundingTitle }}</h5>
                                        <p class="card-text">작성자: {{ funding.makerNick }}</p>
                                        <p class="card-text">달성률: {{ funding.achievementRate }}</p>
                                        <p class="card-text">후원자 수: {{ funding.supportCnt }}</p>
                                        <p class="card-text">찜 수: {{ funding.wishlistCnt }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-4 top-project-list">
            <h2 id="new-funding-title">인기 프로젝트</h2>
            <div id="top-cards" class="row row-cols-1 row-cols-md-2 row-cols-lg-1 g-0 ps-3">
                <div class="col" v-for="(funding, index) in topFundingList" :key="index"
                    @click="redirectToFundingDetail(funding.id)">
                    <div class="card mb-3">
                        <div class="row row-cols-1 row-cols-sm-2">
                            <div class="col-6">
                                <img :src="getThumbnailUrl(funding.thumbnailImgUrl)"
                                    class="img-fluid rounded-start object-fit-cover card-image"
                                    :alt="funding.fundingTitle" @error="handleImageError">
                            </div>
                            <div class="col-6">
                                <div class="card-body">
                                    <h5 class="card-title">{{ funding.fundingTitle }}</h5>
                                    <p class="card-text">작성자: {{ funding.makerNick }}</p>
                                    <p class="card-text">달성률: {{ funding.achievementRate }}</p>
                                    <p class="card-text">후원자 수: {{ funding.supportCnt }}</p>
                                    <p class="card-text">찜 수: {{ funding.wishlistCnt }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiWrapper from '../../util/axios/axios'
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'

const router = useRouter();

const newFundingList = ref([])
const topFundingList = ref([])
const defaultImageUrl = ref(defaultThumbnail)

// // API 호출 함수
// const fetchFundingList = async (type) => {
//     try {
//         const response = await axios.get(`/api/funding/fundinglist/${type}`)
//         console.log(response.data)
//         return response.data
//     } catch (error) {
//         console.error(`${type}순 펀딩 리스트 요청 중 오류 발생:`, error)
//         return []
//     }
// }

onMounted(async () => {
    // Promise.all을 사용하여 두 API 호출을 병렬로 실행
    const [newFundings, topFundings] = await Promise.all([
        apiWrapper.fetchFundingList('new'),
        apiWrapper.fetchFundingList('top')

    ])

    newFundingList.value = newFundings
    topFundingList.value = topFundings
})

const getThumbnailUrl = (url) => {
    return url || defaultImageUrl.value
}

const handleImageError = (event) => {
    event.target.src = defaultImageUrl.value
}

const redirectToFundingDetail = (fundingId) => {
    router.push(`/funding/${fundingId}`)
}
</script>


<style scoped>
#promo-container {
    max-width: 100%;
    overflow: hidden;
}

#promo-img {
    width: 100%;
    height: auto;
    max-height: 400px;
    /* 원하는 최대 높이로 조정하세요 */
    object-fit: cover;
    display: block;
}

#new-funding-list {
    padding-top: 30px;
}

#new-funding-title {
    font-weight: bold;
    font-size: 27px;
    text-align: left;
}

.col-6 {
    padding: 0;
}

/* .card {
    padding: 0;
}

.card-text {
    margin: 0;
}

.card-body {
    padding: 0;
}

.card-image {
    min-height: 150px;
} */

#new-cards, #top-cards {
    padding: 0 !important;
}

.col {
    padding: 5px;
}

.card {
    padding: 0;
    overflow: hidden;
    /* 내용이 카드 밖으로 넘치지 않도록 */
}

.card-body {
    padding: 3px;
    /* 카드 본문에 패딩 추가 */
    padding-right: 10px;
}

.card-title {
    font-size: 1rem;
    /* 제목 크기 조정 */
    margin-top: 5px;
    margin-bottom: 0.5rem;
    /* 제목 아래 마진 추가 */
}

.card-text {
    font-size: 0.8rem;
    /* 텍스트 크기 조정 */
    margin-bottom: 0.25rem;
    /* 텍스트 간 간격 조정 */
}

.card-image {
    min-height: 150px;
    width: 100%;
    /* 이미지 너비를 100%로 설정 */
    height: 100%;
    /* 이미지 높이를 100%로 설정 */
    object-fit: cover;
    /* 이미지 비율 유지하면서 컨테이너에 맞춤 */
}

/* 작은 화면에서의 레이아웃 조정 */
@media (max-width: 576px) {
    .card-body {
        padding: 0.25rem;
        /* 더 작은 화면에서 패딩 줄임 */
    }

    .card-title {
        font-size: 0.9rem;
    }

    .card-text {
        font-size: 0.7rem;
    }
}
</style>