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

                    <div id="maker-container" class="border border-light boarder-1 rounded-3 p-3 mt-2">
                        <div class="maker-info">
                            <img :src="getProfileUrl(maker.profileImgUrl)" alt="펀딩 메이커의 프로필 이미지"
                                class="maker-profile-img">
                            <div class="maker-nick">
                                {{ maker.userNick }}
                                <img v-if="maker.isFollowing" class="wish" src="../../assets/wish.png" alt="찜 되어 있음">
                                <img v-else class="wish" src="../../assets/wish-not.png" alt="찜 되어있지 않음">
                            </div>
                        </div>
                        <div class="mt-2">{{ maker.userContent }}</div>
                    </div>
                </div>

                <div id="reward-container" class="mt-4">
                    <div class="reward-header">
                        <h3 class="reward-title">리워드 선택</h3>
                        <p class="funding-period">{{ fundingStartDate }} ~ {{ fundingEndDate }}</p>
                    </div>
                    <div v-for="reward in rewardList" :key="reward.id" class="reward-item">
                        <div class="reward-price">{{ reward.price.toLocaleString() }}원 펀딩</div>
                        <h4 class="reward-name">{{ reward.rewardName }}</h4>
                        <p class="reward-description">{{ reward.explanation }}</p>
                        <div class="reward-details">
                            <p>배송비: {{ reward.deliveryFee.toLocaleString() }}원</p>
                            <p>리워드 발송 시작일: {{ formatDeliveryDate(reward.deliveryStartDate) }}</p>
                        </div>
                        <div class="reward-quantity">
                            <span class="quantity-left">{{ reward.quantityLimit - reward.supportedCnt }}개 남음</span>
                            <span class="quantity-total">총 {{ reward.quantityLimit }}개</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import apiWrapper from '../../util/axios/axios';
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
provide('fundingStartDate', fundingStartDate)
provide('fundingEndDate', fundingEndDate)

const wishlist = ref();
const maker = ref();

const fundingExplanation = ref('');
provide('fundingExplanation', fundingExplanation);

const defaultImageUrl = ref(defaultThumbnail);
const defaultProfileUrl = ref(defaultProfile);

const fundingTitle = ref('');
provide('fundingTitle', fundingTitle)


onMounted(async () => {
    // Promise.all을 사용하여 두 API 호출을 병렬로 실행
    const [data, rewards] = await Promise.all([
        apiWrapper.fetchFundingData(fundingId.value),
        apiWrapper.fetchRewardList(fundingId.value)

    ])

    fundingData.value = data
    rewardList.value = rewards

    fundingExplanation.value = fundingData.value.fundingExplanation;
    fundingTitle.value = fundingData.value.fundingTitle;

    // 태그들 변환해서 담기
    tagList.value = fundingData.value.fundingTag.split(',').map(tag => tag.trim());

    fundingStartDate.value = formatDate(new Date(fundingData.value.fundingStartDate));
    fundingEndDate.value = formatDate(new Date(fundingData.value.fundingEndDate));

    // 남은 날짜 계산 수정
    const today = new Date();
    const endDate = new Date(fundingData.value.fundingEndDate);
    leftDate.value = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

    wishlist.value = data.isWishlist

    maker.value = data.makerDTO
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

function formatDeliveryDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
</script>

<style>
#funding {
    padding: 0;
    padding-bottom: 20px;

}

.main-content {
    min-height: 400px;
    /* 원하는 최소 높이로 조정 가능 */
}

#side-container {
    /* min-width: 370px; */

    padding: 0;
    text-align: justify;
}

.maker-info {
    display: flex;
    align-items: center;
}

.maker-profile-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-right: 15px;
}

.maker-nick {
    display: flex;
    align-items: center;
    font-size: 17px;
    font-weight: bold;
}

.maker-nick img {
    margin-left: 10px;
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
    background-color: #fff;
}

.reward-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #e0e0e0;
}

.reward-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
}

.funding-period {
    font-size: 13px;
    color: #90949c;
    margin: 0;
}

.reward-item {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
}

.reward-price {
    font-size: 18px;
    font-weight: bold;
    color: #00b2b2;
    margin-bottom: 10px;
}

.reward-name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
}

.reward-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
}

.reward-details {
    font-size: 13px;
    color: #888;
    margin-bottom: 15px;
}

.reward-quantity {
    font-size: 13px;
}

.quantity-left {
    font-weight: bold;
    color: #00b2b2;
    margin-right: 10px;
}

.quantity-total {
    color: #888;
}
</style>