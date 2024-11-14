<template>
    <div id="funding" class="container-xxl">
        <div class="row">
            <!-- 좌측 본문 영역 -->
            <div class="main-content col-lg-8">
                <RouterView v-slot="{ Component }">
                    <component :is="Component" :fundingId="fundingId" />
                </RouterView>
            </div>

            <!-- 우측 사이드바 -->
            <div id="side-container" class="col-lg-4">
                <div v-if="fundingData">
                    <div id="funding-data-container" class="border border-light boarder-1 rounded-3 p-3">
                        <div class="d-flex justify-content-between align-items-center ms-3">
                            <div>
                                {{ fundingData.mainCategoryNm }}&nbsp;&nbsp;>&nbsp;&nbsp;{{ fundingData.subCategoryNm }}
                            </div>
                            <div class="me-3">
                                <img v-if="wishlist" class="wish" src="../../assets/wish.png" alt="찜 되어 있음">
                                <img v-else class="wish" src="../../assets/wish-not.png" alt="찜 되어있지 않음">
                                &nbsp;&nbsp;
                                <img class="share" src="../../assets/share.png" alt="공유하기">
                            </div>
                        </div>
                        <!-- <hr class="secondary"> -->
                        <div class="m-1 mt-3">
                            <div>
                                <h2 id="funding-title">{{ fundingData.fundingTitle }}</h2>
                                <span v-for="tag in tagList" :key="tag" class="tag">#{{ tag }}&nbsp;&nbsp;</span>
                            </div>
                            <div class="row mt-3">
                                <div class="col">{{ fundingData.supportCnt }}명 참여</div>
                                <div class="col">{{ leftDate }}일 남음</div>
                            </div>
                            <div class="row">
                                <div class="col">{{ fundingData.currentAmount }}원 달성</div>
                                <div class="col">{{ fundingData.achievementRate }}% 달성</div>
                            </div>
                            <div>펀딩 목표금액: {{ fundingData.targetAmount }}</div>
                        </div>
                    </div>

                    <div id="maker-container" class="border border-light boarder-1 rounded-3 p-3 mt-1">
                        <div class="row">
                            <div class="col">
                                <img :src="getProfileUrl(maker.profileImgUrl)" alt="펀딩 메이커의 프로필 이미지">
                            </div>
                            <div class="col">
                                <div>
                                    {{ maker.userNick }}
                                    <!-- 팔로우 시 체크 팔로우 해제 시 플러스 -->
                                    <img v-if="maker.isFollowing" class="wish" src="../../assets/wish.png"
                                        alt="찜 되어 있음">
                                    <img v-else class="wish" src="../../assets/wish-not.png" alt="찜 되어있지 않음">
                                </div>
                            </div>
                        </div>
                        <div>{{ maker.userContent }}</div>
                    </div>
                </div>

                <div id="reward-container">
                    <div>
                        <div>리워드 선택</div>
                        <div>진행 기간: {{ fundingStartDate }} ~ {{ fundingEndDate }}</div>
                    </div>
                    <div v-for="reward in rewardList" :key="reward.id" class="border border-light boarder-1 rounded-3 p-3">
                        <div>{{ reward.rewardName }}</div>
                        <div>{{ reward.price }}</div>
                        <div>{{ reward.explanation }}</div>
                        <div>{{ reward.deliveryFee }}</div>
                        <div>{{ reward.deliveryStartDate }}</div>
                        <div>{{ reward.quantityLimit }}</div>
                        <div>{{ reward.supportedCnt }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'
import defaultProfile from '../../assets/default_profile.png'

const route = useRoute(); // 현재 경로 정보를 가져오기 위해 useRoute 사용

const fundingId = ref(route.params.id);
provide('fundingId', fundingId);

const fundingData = ref();
const rewardList = ref([]);

const tagList = ref([]);

const fundingStartDate = ref();
const fundingEndDate = ref();
const leftDate = ref(0);

const wishlist = ref();
const maker = ref();

const defaultImageUrl = ref(defaultThumbnail);
const defaultProfileUrl = ref(defaultProfile);



// 펀딩 프로젝트 디테일 정보(펀딩 메이커 DTO 포함)
// 리워드 정보 리스트

const fetchFundingData = async (id) => {
    try {
        const response = await axios.post(`/api/funding/funding-data/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(`펀딩 프로젝트 ID: ${id}의 데이터 요청 중 오류 발생\n`, error)
        return null
    }
}

const fetchRewardList = async (id) => {
    try {
        const response = await axios.get(`/api/api/reward-list/all/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error(`펀딩 프로젝트 ID: ${id}의 리워드 리스트 요청 중 오류 발생\n`, error)
        return []
    }
};


onMounted(async () => {
    // Promise.all을 사용하여 두 API 호출을 병렬로 실행
    const [data, rewards] = await Promise.all([
        fetchFundingData(fundingId.value),
        fetchRewardList(fundingId.value)
    ])

    fundingData.value = data
    rewardList.value = rewards

    // 태그들 변환해서 담기
    tagList.value = fundingData.value.fundingTag.split(',').map(tag => tag.trim());

    fundingStartDate.value = formatDate(new Date(fundingData.value.fundingStartDate));
    fundingEndDate.value = formatDate(new Date(fundingData.value.fundingEndDate));

    leftDate.value = Math.ceil((fundingData.value.value - new Date()) / (1000 * 60 * 60 * 24));

    wishlist.value = data.isWishlist

    maker.value = data.makerDTO
    console.log(maker.value)
})

const getThumbnailUrl = (url) => {
    return url || defaultImageUrl.value
}

const getProfileUrl = (url) => {
    return url || defaultProfileUrl.value
}



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}
</script>

<style>
#funding {
    padding: 0;
}

.main-content {
    min-height: 400px;
    /* 원하는 최소 높이로 조정 가능 */
}

#side-container {
    min-width: 370px;
    padding: 0;
    text-align: justify;
}

.wish,
.share {
    width: 24px;
    height: 24px;
    margin: 2px;
}

#funding-title {
    font-size: x-large;
    font-weight: bold;
}

#reward-container {
    position: sticky;
    top: 70px;
    z-index: 1000;
}
</style>