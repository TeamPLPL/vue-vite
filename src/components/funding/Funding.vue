<template>
    <div id="funding" class="container-xxl">
        <div class="row">
            <!-- 좌측 본문 영역 -->
            <div class="main-content col-xl">
                <RouterView v-slot="{ Component }">
                    <component :is="Component" :fundingId="fundingId" @showNoticeDetail="handleShowNoticeDetail" />
                </RouterView>
            </div>

            <!-- 우측 사이드바 -->
            <div class="col-12 col-xl-5">
                <div id="side-container" class="sticky-top" style="top: 20px;">
                    <div v-if="fundingData">
                        <!-- 펀딩 정보 컨테이너 -->
                        <div id="funding-data-container" class="border border-light boarder-1 rounded-3 p-3 mb-3">
                            <div class="d-flex justify-content-between align-items-center ms-3">
                                <div>
                                    {{ fundingData.mainCategoryNm }}&nbsp;&nbsp;>&nbsp;&nbsp;{{
                                        fundingData.subCategoryNm }}
                                </div>
                                <div class="me-3 d-flex align-items-center">
                                    <img v-if="isInWishlist" class="wish cursor-pointer" src="../../assets/wish.png"
                                        alt="찜 되어 있음" @click="toggleWishlist(fundingId)">
                                    <img v-else class="wish cursor-pointer" src="../../assets/wish-not.png"
                                        alt="찜 되어있지 않음" @click="toggleWishlist(fundingId)">
                                    &nbsp;&nbsp;
                                    <div class="me-3 share-container">
                                        <img class="share cursor-pointer" src="../../assets/share.png" alt="공유하기"
                                            @click="toggleShareModal">

                                        <div v-if="showShareModal" class="share-modal d-flex flex-row gap-2">
                                            <button @click="shareKakao">카카오 공유</button>
                                            <button @click="shareNaver">네이버 공유</button>
                                            <button @click="copyUrl">URL 복사</button> <!-- URL 복사 버튼 -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="m-1 mt-3 text-start">
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

                        <!-- 메이커 정보 컨테이너  -->
                        <div id="maker-container" class="border border-light boarder-1 rounded-3 p-3 mb-3">
                            <div class="maker-info">
                                <img :src="getProfileUrl(maker.profileImgUrl)" alt="펀딩 메이커의 프로필 이미지"
                                    class="maker-profile-img cursor-pointer">
                                <div class="maker-nick">
                                    {{ maker.userNick }}
                                    <img v-if="maker.isFollowing" class="wish cursor-pointer"
                                        src="../../assets/followed.png" alt="팔로우 되어 있음">
                                    <img v-else class="wish cursor-pointer" src="../../assets/unfollowed.png"
                                        alt="팔로우 되어있지 않음">
                                </div>
                            </div>
                            <div class="mt-2 text-start">{{ maker.userContent }}</div>
                        </div>
                    </div>

                    <div id="reward-container" class="border border-light boarder-1 rounded-3 p-3">
                        <div class="reward-header">
                            <h3 class="reward-title">리워드 선택</h3>
                            <p class="funding-period">{{ fundingStartDate }} ~ {{ fundingEndDate }}</p>
                        </div>
                        <div class="reward-items-wrapper">
                            <div v-for="reward in rewardList" :key="reward.rewardId"
                                class="reward-item text-start mb-3 w-100" @click="selectReward(reward)"
                                :class="{ 'selected': isRewardSelected(reward.rewardId) }">
                                <div class="reward-price">{{ reward.price.toLocaleString() }}원</div>
                                <h4 class="reward-name">{{ reward.rewardName }}</h4>
                                <div class="reward-quantity">
                                    <span class="quantity-left">
                                        {{ (reward.quantityLimit > 0 ? reward.quantityLimit - reward.supportedCnt : 999)
                                        }}개
                                        남음
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-if="selectedRewards.length > 0" class="selected-rewards-container mt-3">
                            <div v-for="selectedReward in selectedRewards" :key="selectedReward.id"
                                class="selected-reward-item p-3 mb-2 w-100">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">{{ selectedReward.rewardName }}</h5>
                                    <button class="btn-close"
                                        @click.stop="removeSelectedReward(selectedReward)"></button>
                                </div>
                                <div class="quantity-selector mt-2 d-flex align-items-center">
                                    <button class="btn btn-outline-secondary btn-sm"
                                        @click.stop="decreaseQuantity(selectedReward)"
                                        :disabled="selectedReward.quantity <= 1">-</button>
                                    <input type="text" class="form-control form-control-sm mx-2 text-center"
                                        style="width: 60px;" v-model="selectedReward.quantity" readonly>
                                    <button class="btn btn-outline-secondary btn-sm"
                                        @click.stop="increaseQuantity(selectedReward)"
                                        :disabled="!canIncreaseQuantity(selectedReward)">+</button>
                                    <span class="ms-3">
                                        {{ (selectedReward.price * selectedReward.quantity).toLocaleString() }}원
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- 후원하기 버튼 -->
                        <div class="mt-3 mx-2">
                            <button id="support-button" class="btn btn-primary btn-lg w-100"
                                @click="handleSupportPurchase">
                                후원하기
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, provide, inject, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import { useAuthStore } from '../../util/store/authStore';
import { useWishlistStore } from '../../util/store/wishlistStore';
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'
import defaultProfile from '../../assets/default_profile.png'

const route = useRoute();
const router = useRouter();
const fundingId = ref(route.params.id);
provide('fundingId', fundingId);

const authStore = useAuthStore();
const wishlistStore = useWishlistStore();


//////// 사이드바고정

const handleScroll = () => {
    const rewardContainer = document.getElementById('reward-container');
    const fundingDataContainer = document.getElementById('funding-data-container');
    const footer = document.querySelector('footer');

    if (!rewardContainer || !fundingDataContainer || !footer) return;

    // xl 브레이크포인트 체크 (1200px)
    if (window.innerWidth >= 1200) {
        const fundingDataBottom = fundingDataContainer.getBoundingClientRect().bottom;
        const footerTop = footer.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        if (fundingDataBottom > 0) {
            rewardContainer.style.position = 'static';
        } else if (footerTop > windowHeight) {
            rewardContainer.style.position = 'fixed';
            rewardContainer.style.top = '20px';
            rewardContainer.style.width = rewardContainer.parentElement.offsetWidth + 'px';
        } else {
            const bottomPosition = windowHeight - footerTop;
            rewardContainer.style.position = 'absolute';
            rewardContainer.style.bottom = bottomPosition + 'px';
            rewardContainer.style.top = 'auto';
        }

        updateRewardContainerWidth();
    } else {
        // xl 미만일 때는 모든 스타일 초기화
        rewardContainer.style.position = 'static';
        rewardContainer.style.top = 'auto';
        rewardContainer.style.bottom = 'auto';
        rewardContainer.style.width = 'auto';
    }
};

const updateSidebarPosition = () => {
    const sideContainer = document.getElementById('side-container');
    const footer = document.querySelector('footer');
    const mainContent = document.querySelector('.main-content');

    if (!sideContainer || !footer || !mainContent) return;

    // xl 브레이크포인트 체크 (1200px)
    if (window.innerWidth >= 1200) {
        const sideContainerRect = sideContainer.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        const mainContentRect = mainContent.getBoundingClientRect();
        const sideContainerBottom = sideContainerRect.bottom + window.scrollY;
        const footerTop = footerRect.top + window.scrollY;
        const mainContentBottom = mainContentRect.bottom + window.scrollY;

        if (sideContainerBottom + 20 > footerTop) {
            sideContainer.style.position = 'absolute';
            sideContainer.style.top = `${mainContentBottom - sideContainer.offsetHeight}px`;
        } else if (window.scrollY > mainContentRect.top) {
            sideContainer.style.position = 'fixed';
            sideContainer.style.top = '20px';
            sideContainer.style.width = `${sideContainer.offsetWidth}px`;
        } else {
            sideContainer.style.position = 'static';
            sideContainer.style.width = 'auto';
        }

        updateRewardContainerWidth();
    } else {
        // xl 미만일 때는 모든 스타일 초기화
        sideContainer.style.position = 'static';
        sideContainer.style.top = 'auto';
        sideContainer.style.width = 'auto';
    }
};

const updateRewardContainerWidth = () => {
    const sideContainer = document.getElementById('side-container');
    const rewardContainer = document.getElementById('reward-container');
    if (sideContainer && rewardContainer) {
        rewardContainer.style.width = `${sideContainer.offsetWidth}px`;
    }
};

/////////// 사이드바 고정 완



//////////////////// wishlist start
const isInWishlist = ref(false);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isInitialLoad = ref(true);

// 인증 에러 처리를 위한 별도의 함수
// const handleAuthError = () => {
//     alert('인증이 만료되었습니다. 다시 로그인해 주세요.');
//     router.push('/login');
// };

const checkWishlistStatus = async () => {
    if (!isAuthenticated.value) {
        isInWishlist.value = false;
        return;
    }

    try {
        const response = await wishlistStore.checkWishlistStatus(fundingId.value);
        console.log("checkWishlistStatus: " + response)
        isInWishlist.value = response;
    } catch (error) {
        console.error('찜 상태 확인 중 오류 발생:', error);
        if (!isInitialLoad.value && error.response && error.response.status === 401) {
            handleAuthError();
        }
    } finally {
        isInitialLoad.value = false;
    }
};

const toggleWishlist = async () => {
    if (!isAuthenticated.value) {
        alert('로그인 된 사용자만 이용 가능한 기능입니다.');
        return;
    }

    try {
        console.log("isInWishlist.value: " + isInWishlist.value)
        if (isInWishlist.value) {
            await wishlistStore.removeFromWishlist(fundingId.value);
        } else {
            await wishlistStore.addToWishlist(fundingId.value);
        }
        isInWishlist.value = !isInWishlist.value;
        console.log("처리 후 isInWishlist.value: " + isInWishlist.value)
    } catch (error) {
        if (error.response && error.response.status === 401) {
            handleAuthError();
        } else {
            console.error('찜 토글 중 오류 발생:', error);
            alert('찜 기능 처리 중 오류가 발생했습니다.');
        }
    }
};

const handleAuthError = () => {
    alert('인증이 만료되었습니다. 다시 로그인해 주세요.');
    authStore.logout(); // 로그아웃 처리
};

////////////////////// wishlist end

////////////////////// share start

// 공유 모달 관련 상태 추가
const showShareModal = ref(false);
const shareUrl = ref(window.location.href);

// 공유 모달 토글 함수
const toggleShareModal = () => {
    showShareModal.value = !showShareModal.value;
};

// 공유 함수들 추가
const shareKakao = () => {
    // Kakao SDK 초기화 필요
    window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
            title: fundingTitle.value,
            description: fundingData.value.fundingExplanation,
            imageUrl: getThumbnailUrl(fundingData.value.thumbnailUrl),
            link: {
                mobileWebUrl: shareUrl.value,
                webUrl: shareUrl.value,
            },
        },
    });
};

const shareNaver = () => {
    const url = encodeURI(encodeURIComponent(shareUrl.value));
    const title = encodeURI(fundingTitle.value);
    window.open(`https://share.naver.com/web/shareView?url=${url}&title=${title}`);
};

const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl.value)
        .then(() => {
            alert('URL이 복사되었습니다.');
        })
        .catch(err => {
            console.error('URL 복사 중 오류 발생:', err);
        });
};

////////////////////// share end

const fundingData = ref();
const rewardList = ref([]);

const tagList = ref([]);

const fundingStartDate = ref();
const fundingEndDate = ref();
const leftDate = ref(0);
provide('fundingStartDate', fundingStartDate)
provide('fundingEndDate', fundingEndDate)

// const wishlist = ref();
const maker = ref();

const fundingExplanation = ref('');
provide('fundingExplanation', fundingExplanation);

const defaultImageUrl = ref(defaultThumbnail);
const defaultProfileUrl = ref(defaultProfile);

const fundingTitle = ref('');
provide('fundingTitle', fundingTitle)

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleScroll);
    window.removeEventListener('scroll', updateSidebarPosition);
    window.removeEventListener('resize', updateSidebarPosition);

    window.removeEventListener('resize', updateRewardContainerWidth);
});

onMounted(async () => {
    // Promise.all을 사용하여 두 API 호출을 병렬로 실행
    const [data, rewards] = await Promise.all([
        apiWrapper.fetchFundingData(fundingId.value),
        apiWrapper.fetchRewardList(fundingId.value)

    ])

    fundingData.value = data
    console.log("rewards: " + rewards)
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

    // wishlist.value = data.isWishlist

    maker.value = data.makerDTO

    await checkWishlistStatus();


    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    window.addEventListener('scroll', updateSidebarPosition);
    window.addEventListener('resize', updateSidebarPosition);

    window.addEventListener('resize', updateRewardContainerWidth);
    updateRewardContainerWidth(); // 초기 로드 시 실행

    handleScroll();
    updateSidebarPosition();
},
    // window.addEventListener('scroll', handleScroll)
)

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
provide('formatDate', formatDate);

function formatDeliveryDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

////////// 작성자 체크

// 프로젝트 작성자 여부를 확인하는 로직
const isCreator = computed(() => {
    if (!maker.value?.makerEmail) {
        console.log("메이커 정보가 없습니다.");
        return false;
    }

    const userInfo = authStore.getUserInfo();
    if (!userInfo?.email) {
        console.log("사용자 정보가 없습니다.");
        return false;
    }

    console.log("현재 사용자 이메일:", userInfo.email);
    console.log("메이커 이메일:", maker.value.makerEmail);

    const isCreatorResult = userInfo.email === maker.value.makerEmail;
    console.log("작성자 여부:", isCreatorResult);

    return isCreatorResult;
});

provide('isCreator', isCreator);

////////// 작성자 체크 끝

const selectedNotice = inject('selectedNotice', {
    noticeId: 0,
    noticeTitle: '',
    noticeContent: ''
});

provide('selectedNotice', selectedNotice.value);
provide('setSelectedNotice', (notice) => {
    selectedNotice.value = notice;
});

// const handleShowNoticeDetail = (noticeId) => {
//     console.log("handleShoeNoticeDetail 진입")
//     console.log("selectedNotice: " + selectedNotice.value)
//     router.push({
//         name: 'NoticeDetail',
//         params: { id: fundingId.value },
//         query: { noticeId: noticeId },
//     });

// };

const handleShowNoticeDetail = (noticeId) => {
    router.push({
        name: 'NoticeDetail',
        params: { id: fundingId.value },
        query: { noticeId }, // noticeId를 쿼리로 전달
    });
};





////////// 리워드 선택 시작

const selectedRewards = ref([]);


const selectReward = (reward) => {
    if (!isAuthenticated.value) {
        alert("로그인이 필요한 기능입니다.")
        return;
    }

    if (!validateRewardSelection(reward)) return;

    const existingRewardIndex = selectedRewards.value.findIndex(r => r.rewardId === reward.rewardId);
    if (existingRewardIndex === -1) {
        // 새로운 리워드 추가
        const newReward = {
            rewardId: reward.rewardId,
            rewardName: reward.rewardName,
            price: reward.price,
            quantity: 1,
            quantityLimit: reward.quantityLimit || Infinity,
            supportedCnt: reward.supportedCnt,
            deliveryFee: reward.deliveryFee
        };
        selectedRewards.value.push(newReward);
    } else {
        // 이미 선택된 리워드라면 수량 증가
        increaseQuantity(selectedRewards.value[existingRewardIndex]);
    }
};

const validateRewardSelection = (reward) => {
    const remainingQuantity = reward.quantityLimit ? reward.quantityLimit - reward.supportedCnt : Infinity;
    if (remainingQuantity <= 0) {
        alert('이 리워드의 수량이 모두 소진되었습니다.');
        return false;
    }
    return true;
};

const removeSelectedReward = (reward) => {
    const index = selectedRewards.value.findIndex(r => r.rewardId === reward.rewardId);
    if (index !== -1) {
        selectedRewards.value.splice(index, 1);
    }
};

const increaseQuantity = (reward) => {
    if (canIncreaseQuantity(reward)) {
        reward.quantity++;
    }
};

const decreaseQuantity = (reward) => {
    if (reward.quantity > 1) {
        reward.quantity--;
    } else {
        removeSelectedReward(reward);
    }
};

const canIncreaseQuantity = (reward) => {
    const remainingQuantity = reward.quantityLimit ? reward.quantityLimit - reward.supportedCnt : Infinity;
    return reward.quantity < remainingQuantity;
};

const isRewardSelected = (rewardId) => {
    return selectedRewards.value.some(r => r.rewardId === rewardId);
};




////////// 리워드 선택 끝


/////// 구매하기

const handleSupportPurchase = () => {
    if (!isAuthenticated.value) {
        alert('로그인이 필요한 기능입니다.')
        return;
    }

    if (selectedRewards.value.length === 0) {
        alert('리워드를 선택해주세요.');
        return;
    }

    console.log('selectedRewards:', selectedRewards.value);

    // selectedRewards에서 rewardId와 count만 추출
    const simplifiedRewards = selectedRewards.value.map(reward => ({
        rewardId: reward.rewardId,
        count: reward.quantity
    }));

    console.log('simplifiedRewards:', simplifiedRewards);

    router.push({
        name: 'ChooseReward',
        params: { id: fundingId.value },
        // state: { selectedRewards: simplifiedRewards }
        query: { selectedRewards: JSON.stringify(simplifiedRewards) }
    });
};

////////
</script>

<style scoped>
#funding {
    padding: 0;
    padding-bottom: 20px;

}

.main-content {
    min-height: 400px;
    /* 원하는 최소 높이로 조정 가능 */
}

#side-container {
    /* padding: 0;
    text-align: justify;
    height: 100vh;
    overflow-y: auto;
    transition: all 0.3s ease;
    position: relative; */

    padding: 0;
    text-align: justify;
    transition: all 0.3s ease;
    position: relative;
    overflow-x: hidden;
}

@media (min-width: 1200px) {
    #side-container {
        height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #reward-container {
        max-height: calc(100vh - 40px);
        overflow-y: auto;
        overflow-x: hidden;
    }
}

.sticky-top {
    position: sticky;
    top: 70px;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
    overflow-x: hidden;
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

.sticky-reward {
    position: sticky;
    top: 100px;
    /* 화면 상단에서의 거리 (조정 가능) */
    z-index: 10;
    /* 다른 요소 위로 올라오도록 설정 */
    background-color: white;
    /* 배경색 추가 (투명하지 않게) */
    padding-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    /* 약간의 그림자 효과 */
}

#funding-title {
    font-size: x-large;
    font-weight: bold;
}

#reward-container {
    background-color: #f8f9fa;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.reward-items-wrapper {
    /* max-height: calc(100vh - 300px);
    overflow-y: auto;*/
    overflow-y: visible;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #cccccc #ffffff;
    transition: max-height 0.3s ease;
    padding-right: 10px;
}

/* 스크롤바 스타일링
.reward-items-wrapper::-webkit-scrollbar {
    width: 6px;
}

.reward-items-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.reward-items-wrapper::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

.reward-items-wrapper::-webkit-scrollbar-thumb:hover {
    background: #555;
}
     */

#side-container::-webkit-scrollbar {
    width: 6px;
}

#side-container::-webkit-scrollbar-track {
    background: #f1f1f1;
}

#side-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
}

#side-container::-webkit-scrollbar-thumb:hover {
    background: #555;
}

.reward-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #dee2e6;
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









@media (min-width: 576px) {

    .reward-item,
    .selected-reward-item {
        width: 100%;
    }
}

@media (min-width: 768px) {

    .reward-item,
    .selected-reward-item {
        width: 100%;
    }
}

@media (min-width: 992px) {

    .reward-item,
    .selected-reward-item {
        width: 100%;
    }
}

@media (min-width: 1200px) {

    .reward-item,
    .selected-reward-item {
        width: 100%;
    }
}

@media (min-width: 1400px) {

    .reward-item,
    .selected-reward-item {
        width: 100%;
    }
}

.selected-rewards-container {
    padding-right: 10px;
}




.reward-item,
.selected-reward-item {
    width: 100%;
    padding: 15px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

.reward-item {
    cursor: pointer;
    transition: all 0.2s ease;
}

.reward-item:hover {
    background-color: #f8f9fa;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.reward-item.selected {
    border: 2px solid #00b2b2;
    background-color: #f0ffff;
}

.selected-reward-item {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
}

.quantity-selector {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
}

.quantity-selector input {
    width: 60px;
    text-align: center;
}

.quantity-selector button {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}







/*
.reward-item {
    padding: 15px;
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.reward-item:hover {
    background-color: #f8f9fa;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.reward-item.selected {
    border: 2px solid #00b2b2;
    background-color: #f0ffff;
}

.selected-reward-item {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
}


.quantity-selector input {
    border: 1px solid #dee2e6;
    border-radius: 4px;
}

.quantity-selector button {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
        */

.btn-close {
    font-size: 0.8rem;
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

.share-container {
    position: relative;
    /* 부모 요소를 기준으로 자식 요소의 위치를 설정 */
}

.share-modal {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    z-index: 1000;
    display: flex;
    /* Flexbox를 유지 */
    flex-direction: column;
    /* 세로 정렬을 위한 설정 */
    gap: 10px;
    /* 버튼 간 간격 설정 */
    align-items: stretch;
    /* 버튼이 모달의 너비를 차지하도록 설정 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);

}

.share-modal button {
    display: block;
    /* 각 버튼을 블록 요소로 설정 */
    width: 100%;
    /* 버튼이 모달의 전체 너비를 차지 */
    padding: 8px 12px;
    background-color: #e0e0e0;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    text-align: center;
    /* 텍스트 중앙 정렬 */
    white-space: nowrap;
    /* 텍스트가 한 줄로 표시되도록 설정 */
    color: #fff;
}

.share-modal button:hover {
    background-color: #d0d0d0;
    color: #444;
}

.cursor-pointer {
    cursor: pointer;
}

#suppport-button {
    background-color: #00b2b2;
    border-color: #00b2b2;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

#suppport-button:hover:not(:disabled) {
    background-color: #009999;
    border-color: #009999;
}

#suppport-button:disabled {
    background-color: #cccccc;
    border-color: #cccccc;
    cursor: not-allowed;
}
</style>
