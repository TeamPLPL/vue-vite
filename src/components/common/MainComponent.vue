<template>
    <div class="container-lg row">
        <div class="col-lg-8">
            <div id="promo-container">
                <img id="promo-img" src="../../assets/promotion_default_img.jpeg" alt="">
            </div>
            <div id="new-funding-list">
                <h2 id="new-funding-title">최신 프로젝트</h2>
                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-2 ps-3">
                    <div class="col" v-for="(funding, index) in newFundingList" :key="index"
                        @click="redirectToFundingDetail(funding.id)">
                        
                        <div class="card mb-3">
                            <div class="row row-cols-xs-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2">
                                <div class="col-6">
                                    <img :src="getThumbnailUrl(funding.thumbnailImgUrl)" 
                                        class="img-fluid rounded-start object-fit-cover card-image"
                                        :alt="funding.fundingTitle"
                                        @error="handleImageError">
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
                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-1 ps-3">
                    <div class="col" v-for="(funding, index) in topFundingList" :key="index"
                        @click="redirectToFundingDetail(funding.id)">
                        <div class="card mb-3">
                            <div class="row row-cols-1 row-cols-sm-2">
                                <div class="col-6">
                                    <img :src="getThumbnailUrl(funding.thumbnailImgUrl)" 
                                        class="img-fluid rounded-start object-fit-cover card-image"
                                        :alt="funding.fundingTitle"
                                        @error="handleImageError">
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
import axios from 'axios'
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'

const router = useRouter()

const newFundingList = ref([])
const topFundingList = ref([])
const defaultImageUrl = ref(defaultThumbnail)

// API 호출 함수
const fetchFundingList = async (type) => {
    try {
        const response = await axios.get(`/api/funding/fundinglist/${type}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(`${type}순 펀딩 리스트 요청 중 오류 발생:`, error)
        return []
    }
}

onMounted(async () => {
    // Promise.all을 사용하여 두 API 호출을 병렬로 실행
    const [newFundings, topFundings] = await Promise.all([
        fetchFundingList('new'),
        fetchFundingList('top')
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
    router.push(`/funding/detail/${fundingId}`)
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
        max-height: 400px; /* 원하는 최대 높이로 조정하세요 */
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

    .card {
        padding: 0;
    }

    .card-text {
        margin: 0;
    }

    .card-body {
        padding: 0;
    }

    .card-image {
        min-height:150px;
    }
</style>