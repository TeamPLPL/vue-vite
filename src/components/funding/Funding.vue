<template>
    <div id="funding" class="container-xxl">
        <div class="row">
            <!-- 좌측 본문 영역 -->
            <div class="main-content col-lg-8">
                <RouterView v-slot="{ Component }">
                    <component :is="Component" :fundingId="fundingId" @showNoticeDetail="handleShowNoticeDetail" />
                </RouterView>
            </div>

            <!-- 우측 사이드바 -->
            <div id="side-container sticky-top" class="col-lg-4" style="top: 300px;">
                <div v-if="fundingData">
                    <div id="funding-data-container" class="border border-light boarder-1 rounded-3 p-3">
                        <div class="d-flex justify-content-between align-items-center ms-3">
                            <div>
                                {{ fundingData.mainCategoryNm }}&nbsp;&nbsp;>&nbsp;&nbsp;{{ fundingData.subCategoryNm }}
                            </div>
                            <div class="me-3 d-flex align-items-center">
                                <img v-if="isInWishlist" class="wish cursor-pointer" src="../../assets/wish.png"
                                    alt="찜 되어 있음" @click="toggleWishlist(fundingId)">
                                <img v-else class="wish cursor-pointer" src="../../assets/wish-not.png" alt="찜 되어있지 않음"
                                    @click="toggleWishlist(fundingId)">
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
                                <!-- <img class="share" src="../../assets/share.png" alt="공유하기" @click="toggleShareModal">

                                <div v-if="showShareModal" class="share-modal">
                                    <button @click="shareKakao">카카오 공유</button>
                                    <button @click="shareNaver">네이버 공유</button>
                                    <button @click="copyUrl">URL 복사</button>
                                </div> -->
                            </div>
                        </div>
                        <!-- <hr class="secondary"> -->
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

                    <div id="maker-container" class="border border-light boarder-1 rounded-3 p-3 mt-2">
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

                <div id="reward-container" class="mt-4">
                    <div class="reward-header">
                        <h3 class="reward-title">리워드 선택</h3>
                        <p class="funding-period">{{ fundingStartDate }} ~ {{ fundingEndDate }}</p>
                    </div>
                    <!-- 스크롤 가능한 컨테이너 추가 -->
                    <div class="reward-items-wrapper sticky-reward">
                        <div v-for="reward in rewardList" :key="reward.id" class="reward-item text-start">
                            <div class="reward-price">{{ reward.price.toLocaleString() }}원</div>
                            <h4 class="reward-name">{{ reward.rewardName }}</h4>
                            <p class="reward-description">{{ reward.explanation }}</p>
                            <div class="reward-details">
                                <p>배송비: {{ reward.deliveryFee.toLocaleString() }}원</p>
                                <p>리워드 발송 시작 예정일: {{ formatDeliveryDate(reward.deliveryStartDate) }}</p>
                            </div>
                            <div class="reward-quantity">
                                <span class="quantity-left">{{ (reward.quantityLimit > 0 ? reward.quantityLimit -
                                    reward.supportedCnt : 999) }}개 남음</span>
                                <span class="quantity-total">총 {{ reward.quantityLimit > 0 ? reward.quantityLimit : 999
                                    }}개</span>
                            </div>
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
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'
import defaultProfile from '../../assets/default_profile.png'

const route = useRoute();
const router = useRouter();
const fundingId = ref(route.params.id);
provide('fundingId', fundingId);

const authStore = useAuthStore();


//////// 사이드바고정

const handleScroll = () => {
    const rewardContainer = document.getElementById('reward-container');
    const rewardItemsWrapper = document.querySelector('.reward-items-wrapper');
    const fundingDataContainer = document.getElementById('funding-data-container');
    const footer = document.querySelector('footer');

    if (!rewardContainer || !rewardItemsWrapper || !fundingDataContainer || !footer) return;

    const fundingDataBottom = fundingDataContainer.getBoundingClientRect().bottom + window.scrollY;
    const footerTop = footer.getBoundingClientRect().top + window.scrollY;
    const footerHeight = footer.offsetHeight; // 푸터 높이
    const rewardContainerHeight = rewardContainer.offsetHeight;
    const windowScrollTop = window.scrollY;

    const desiredSpacing = 30; // 상단 여백
    const footerBuffer = footerHeight + 20; // 푸터와의 거리 설정 (푸터 높이 + 추가 여백)
    const initialHeight = 300; // 초기 높이
    const viewportHeight = window.innerHeight;
    const wrapperScrollHeight = rewardItemsWrapper.scrollHeight; // .reward-items-wrapper의 실제 스크롤 높이

    // 스크롤에 따른 reward-container의 높이 계산
    const availableHeight = footerTop - windowScrollTop - footerBuffer;

    if (windowScrollTop < fundingDataBottom) {
        // 1. 맨 위: rewardContainer가 fundingDataContainer에 붙음
        rewardContainer.style.position = 'sticky';
        rewardContainer.style.top = `${fundingDataContainer.offsetHeight}px`;
        rewardItemsWrapper.style.maxHeight = `${initialHeight}px`;
    } else if (windowScrollTop >= fundingDataBottom && footerTop > windowScrollTop + viewportHeight) {
        // 2. fundingDataContainer가 화면에서 벗어남: rewardContainer가 화면 높이를 기준으로 확장
        rewardContainer.style.position = 'fixed';
        rewardContainer.style.top = `${desiredSpacing}px`;
        rewardItemsWrapper.style.maxHeight = `${Math.min(wrapperScrollHeight, viewportHeight - desiredSpacing)}px`;
    } else if (footerTop <= windowScrollTop + viewportHeight && footerTop > windowScrollTop + rewardContainerHeight) {
        // 3. 푸터와 가까워질 때: rewardContainer 높이를 줄임
        rewardContainer.style.position = 'fixed';
        rewardContainer.style.top = `${desiredSpacing}px`;

        const shrinkingHeight = footerTop - windowScrollTop - footerBuffer;
        rewardItemsWrapper.style.maxHeight = `${Math.max(initialHeight, Math.min(wrapperScrollHeight, shrinkingHeight))}px`;
    } else if (footerTop <= windowScrollTop + footerBuffer) {
        // 4. 푸터 근처: 푸터에서 footerBuffer만큼 떨어진 위치에 고정
        rewardContainer.style.position = 'absolute';
        rewardContainer.style.top = 'auto';
        rewardContainer.style.bottom = `${footerBuffer}px`; // 푸터에서 footerBuffer만큼 떨어짐
        const maxHeight = footerTop - windowScrollTop - footerBuffer;
        rewardItemsWrapper.style.maxHeight = `${Math.max(initialHeight, Math.min(wrapperScrollHeight, maxHeight))}px`; // 최소 높이 보장
    }

    // ** 위로 스크롤 시 높이 복구 로직 추가 **
    if (windowScrollTop < fundingDataBottom) {
        rewardContainer.style.position = 'sticky';
        rewardContainer.style.top = `${fundingDataContainer.offsetHeight}px`;
        rewardItemsWrapper.style.maxHeight = `${Math.min(wrapperScrollHeight, viewportHeight - desiredSpacing)}px`;
    }
};
/////////// 사이드바 고정 완



//////////////////// wishlist start
const wishlistStore = inject('wishlistStore');
const isInWishlist = ref(false);
const isAuthenticated = computed(() => wishlistStore.getters.getIsAuthenticated());
const isInitialLoad = ref(true);

// 인증 에러 처리를 위한 별도의 함수
const handleAuthError = () => {
    alert('인증이 만료되었습니다. 다시 로그인해 주세요.');
    router.push('/login');
};

const checkWishlistStatus = async () => {
    // try {
    //     isInWishlist.value = await wishlistStore.actions.checkWishlistStatus(fundingId.value);
    // } catch (error) {
    //     console.error('찜 상태 확인 중 오류 발생:', error);
    // }
    if (!isAuthenticated.value) {
        isInWishlist.value = false;
        return;
    }

    try {
        isInWishlist.value = await wishlistStore.actions.checkWishlistStatus(fundingId.value);
    } catch (error) {
        console.error('찜 상태 확인 중 오류 발생:', error);
        // 초기 로딩 시 401 에러를 무시
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
        if (isInWishlist.value) {
            await wishlistStore.actions.removeFromWishlist(fundingId.value);
        } else {
            await wishlistStore.actions.addToWishlist(fundingId.value);
        }
        isInWishlist.value = !isInWishlist.value;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert('로그인 된 사용자만 이용 가능한 기능입니다.');
        } else {
            console.error('찜 토글 중 오류 발생:', error);
        }
    }
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
});

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

    // wishlist.value = data.isWishlist

    maker.value = data.makerDTO

    await checkWishlistStatus();
    window.addEventListener('scroll', handleScroll)
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
    padding: 0;
    text-align: justify;
    height: 100vh;
    overflow-y: auto;
}

.sticky-top {
    position: sticky;
    top: 70px;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
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
    top: 100px; /* 화면 상단에서의 거리 (조정 가능) */
    z-index: 10; /* 다른 요소 위로 올라오도록 설정 */
    background-color: white; /* 배경색 추가 (투명하지 않게) */
    padding-bottom: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
}

#funding-title {
    font-size: x-large;
    font-weight: bold;
}

/* #reward-container {
    position: sticky;
    top: 70px;
    z-index: 2000;
    background-color: #fff;
} */
#reward-container {
    position: sticky;
    top: 20px; /* 페이지 상단에서 20px 떨어진 위치에서 고정 */
    max-height: calc(100vh - 40px); /* 화면 높이에서 여유 공간 확보 */
    overflow-y: auto; /* 내부 스크롤 활성화 */
    background-color: #fff; /* 배경색 설정 */
    padding: 10px; /* 여백 추가 */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 시각적인 구분을 위한 그림자 효과 */
}

/* 리워드 아이템들을 감싸는 새로운 div 추가 */
.reward-items-wrapper {
    max-height: 300px;
    /* 조정 가능한 값 */
    overflow-y: auto;
    scrollbar-width: thin; /* Firefox에서 얇은 스크롤바 */
    scrollbar-color: #cccccc #ffffff; /* Firefox에서 스크롤바 색상 */
    transition: max-height 0.3s ease; /* 부드러운 높이 변경 효과 */
}

.reward-items-wrapper::-webkit-scrollbar {
    width: 8px; /* 스크롤바 너비 */
}

.reward-items-wrapper::-webkit-scrollbar-thumb {
    background-color: #cccccc; /* 스크롤바 색상 */
    border-radius: 4px;
}

.reward-items-wrapper::-webkit-scrollbar-track {
    background-color: #ffffff; /* 트랙 색상 */
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
</style>