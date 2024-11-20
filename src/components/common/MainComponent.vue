<template>
    <div class="container-lg">
        <div class="container-lg row">
            <div class="col-lg-8">
                <div id="promo-container">
                    <img id="promo-img" src="../../assets/promotion_default_img.jpeg" alt="">
                </div>
                <div id="new-funding-list">
                    <h2 id="new-funding-title">최신 프로젝트</h2>
                    <div id="new-cards"
                        class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 ps-3 cursor-pointer">
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
            <div class="col-lg-4">
                <div id="top-funding-list">
                    <h2 id="top-funding-title">인기 프로젝트</h2>
                    <div id="top-cards" class="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-1 ps-3">
                        <div class="col" v-for="(funding, index) in topFundingList" :key="index"
                            @click="redirectToFundingDetail(funding.id)">
                            <div class="card mb-3 cursor-pointer">
                                <div class="row row-cols-xs-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 g-0">
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
    min-width: 400px;
    overflow: hidden;
}

#promo-img {
    width: 100%;
    height: auto;
    max-height: 400px;
    object-fit: cover;
    display: block;
}

#new-funding-list {
    padding-top: 30px;
}

/* md 브레이크포인트 이하에서만 min-width 적용 */
@media (max-width: 767.98px) {

    #new-funding-list,
    #top-funding-list {
        min-width: 400px;
    }
}

#new-funding-title,
#top-funding-title {
    font-weight: bold;
    font-size: 25px;
    text-align: left;
}

.col-6 {
    padding: 0;
}

#new-cards,
#top-cards {
    padding: 0 !important;
    min-width: 310px;
}

.col {
    padding: 5px;
}

.card {
    padding: 0;
    overflow: hidden;
}

.card-body {
    padding: 3px;
    padding-right: 10px;
}

.card-title {
    font-size: 1rem;
    margin-top: 5px;
    margin-bottom: 0.5rem;
}

.card-text {
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
}

.card-image {
    min-height: 150px;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@media (max-width: 576px) {
    .card-body {
        padding: 0.25rem;
    }

    .card-title {
        font-size: 0.9rem;
    }

    .card-text {
        font-size: 0.7rem;
    }
}

.cursor-pointer {
    cursor: pointer;
}
</style>