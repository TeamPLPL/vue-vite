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
        <div id="side-container" class="sticky-top" ref="sideContainer">
          <div id="funding-info-container">
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
<!--                        <button @click="shareKakao">카카오 공유</button>-->
<!--                        <button @click="shareNaver">네이버 공유</button>-->
                        <button @click="copyUrl">URL 복사</button> <!-- URL 복사 버튼 -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="m-1 mt-3 text-start">
                  <div>
                    <h2 id="funding-title">{{ fundingData.fundingTitle }}</h2>
                    <span v-for="tag in tagList" :key="tag" class="tag">#{{ tag
                      }}&nbsp;&nbsp;</span>
                  </div>
                  <div class="row mt-3">
                    <div class="col">{{ fundingData.supportCnt.toLocaleString() }}명 참여</div>
                    <div class="col">{{ leftDate.toLocaleString()  }}일 남음</div>
                  </div>
                  <div class="row">
                    <div class="col">{{ fundingData.currentAmount.toLocaleString()  }}원 달성</div>
                    <div class="col">{{ fundingData.achievementRate }}% 달성</div>
                  </div>
                  <div>펀딩 목표금액: {{ fundingData.targetAmount.toLocaleString()  }}</div>
                </div>
              </div>

              <!-- 메이커 정보 컨테이너  -->
              <div id="maker-container" class="border border-light boarder-1 rounded-3 p-3 mb-3">
                <div class="maker-info">
                  <img :src="getProfileUrl(maker.profileImgUrl)" alt="펀딩 메이커의 프로필 이미지"
                       class="maker-profile-img cursor-pointer">
                  <div class="maker-nick">
                    {{ maker.userNick }}
                    <img v-if="maker.following" class="wish cursor-pointer"
                         src="../../assets/followed.png" alt="팔로우 되어 있음" @click="toggleFollow">
                    <img v-else class="wish cursor-pointer" src="../../assets/unfollowed.png"
                         alt="팔로우 되어있지 않음" @click="toggleFollow">
                  </div>
                </div>
                <div class="mt-2 text-start">{{ maker.userContent }}</div>
              </div>
            </div>
          </div>

          <div id="reward-container" class="border border-light boarder-1 rounded-3 p-3"
               ref="rewardContainer">
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
                <div>{{ reward.explanation }}</div>
                <div class="reward-quantity">
                                    <span class="quantity-left">
                                        {{ (reward.quantityLimit > 0 ? reward.quantityLimit - reward.supportedCnt :
                                        999)
                                      }}개
                                        남음
                                    </span>
                </div>
                <div>배송비: {{ reward.deliveryFee }}</div>
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
import {ref, provide, inject, computed, onMounted, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import {useAuthStore} from '../../util/store/authStore';
import {useWishlistStore} from '../../util/store/wishlistStore';
import defaultThumbnail from '../../assets/default_thumbnail.jpeg'
import defaultProfile from '../../assets/default_profile.png'

import {throttle} from 'lodash';

import {useRewardStore} from "../../util/store/rewardStore.js";

const route = useRoute();
const router = useRouter();
const fundingId = ref(route.params.id);
provide('fundingId', fundingId);

const authStore = useAuthStore();
const wishlistStore = useWishlistStore();


//////// 사이드바고정

const sideContainer = ref(null);
const rewardContainer = ref(null);

const TOPBAR_HEIGHT = 38; // Topbar의 높이
const FUNDING_DETAIL_HEADER_HEIGHT = 60;

const handleScroll = throttle(() => {
  if (window.innerWidth < 1200) {
    resetStyles();
    return;
  }

  const sideRect = sideContainer.value.getBoundingClientRect();
  const rewardRect = rewardContainer.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const footer = document.querySelector('footer');
  const footerTop = footer ? footer.getBoundingClientRect().top : Infinity;
  const headersTotalHeight = TOPBAR_HEIGHT + FUNDING_DETAIL_HEADER_HEIGHT;

  if (window.scrollY > headersTotalHeight) {
    const topPosition = Math.max(20, headersTotalHeight - window.scrollY);
    const containerWidth = sideContainer.value.offsetWidth;

    sideContainer.value.style.position = 'fixed';
    sideContainer.value.style.top = `${topPosition}px`;
    sideContainer.value.style.width = `${containerWidth}px`;

    if (rewardRect.bottom + topPosition > footerTop) {
      const newTop = footerTop - rewardRect.height - topPosition;
      rewardContainer.value.style.position = 'absolute';
      rewardContainer.value.style.top = `${newTop}px`;
      rewardContainer.value.style.width = `${containerWidth}px`;
    } else {
      rewardContainer.value.style.position = 'fixed';
      rewardContainer.value.style.top = `${topPosition}px`;
      rewardContainer.value.style.width = `${containerWidth}px`;
    }
  } else {
    resetStyles();
  }
}, 100);

const resetStyles = () => {
  if (sideContainer.value) {
    sideContainer.value.style.position = 'static';
    sideContainer.value.style.width = 'auto';
  }
  if (rewardContainer.value) {
    rewardContainer.value.style.position = 'static';
    rewardContainer.value.style.top = 'auto';
    rewardContainer.value.style.width = '100%';
  }
};

const handleResize = () => {
  if (window.innerWidth >= 1200) {
    const containerWidth = sideContainer.value.offsetWidth;
    sideContainer.value.style.width = `${containerWidth}px`;
    rewardContainer.value.style.width = '100%';
  } else {
    resetStyles();
  }
};

// const setInitialPosition = () => {
//   if (window.innerWidth >= 1200) {
//     const sideRect = sideContainer.value.getBoundingClientRect();
//     const containerWidth = sideContainer.value.offsetWidth;
//     rewardContainer.value.style.position = 'fixed';
//     rewardContainer.value.style.top = `${TOPBAR_HEIGHT + FUNDING_DETAIL_HEADER_HEIGHT}px`;
//     rewardContainer.value.style.width = `${containerWidth}px`;
//     rewardContainer.value.style.right = `${window.innerWidth - sideRect.right}px`;
//   }
// };


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
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleAuthError();
    } else if (error.response && error.response.status === 400) {
      alert('자신의 글은 찜할 수 없습니다.');
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

///////////////////// follow start
const isFollowing = ref(false);

// 팔로잉 상태
const checkFollowStatus = async () => {
  if (!isAuthenticated.value) {
    isFollowing.value = false;
    return;
  }

  try {
    const response = await apiWrapper.getData(`/api/follow/list`);
    const followList = response || [];
    isFollowing.value = followList.some(follow => follow.name === maker.value.userNick);
    console.log('팔로우 상태', isFollowing.value);
  } catch (error) {
    console.error('팔로우 상태 확인 중 오류 발생:', error);
  }
};

const toggleFollow = async () => {
  if (!isAuthenticated.value) {
    alert('로그인이 필요한 기능입니다.');
    return;
  }

  if (!maker.value?.makerId) {
    console.error('maker.id가 유효하지 않습니다.');
    alert('메이커 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    return;
  }

  try {
    if (isFollowing.value) {
      await apiWrapper.deleteData(`/api/follow/remove/${maker.value.makerId}`);
      maker.value.following = false; // 반응형 속성 업데이트
    } else {
      await apiWrapper.postData(`/api/follow/add/${maker.value.makerId}`, null);
      maker.value.following = true; // 반응형 속성 업데이트
    }
    isFollowing.value = !isFollowing.value;
  } catch (error) {
    console.error('팔로우 상태 변경 중 오류 발생:', error);

    // 서버에서 반환된 에러 메시지 처리
    if (error.response && error.response.status === 400) {
      alert(error.response.data); // "You cannot follow yourself." 등의 메시지 표시
    } else if (error.response && error.response.status === 409) {
      alert(error.response.data); // "Already following this user." 등의 메시지 표시
    } else {
      alert('팔로우 처리 중 문제가 발생했습니다.');
    }
  }
};

///////////////////// follow end

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
  window.removeEventListener('resize', handleResize);
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
  console.log('메이커', maker.value);

  await checkWishlistStatus();
  await checkFollowStatus();


  // setInitialPosition();
  window.addEventListener('scroll', handleScroll, {passive: true});
  window.addEventListener('resize', handleResize, {passive: true});
  handleScroll();
  handleResize();
});

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

const handleShowNoticeDetail = (noticeId) => {
  router.push({
    name: 'NoticeDetail',
    params: {id: fundingId.value},
    query: {noticeId}, // noticeId를 쿼리로 전달
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
const rewardStore = useRewardStore()

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
    quantity: reward.quantity
  }));

  console.log('simplifiedRewards:', simplifiedRewards);

  rewardStore.setSelectedRewards(simplifiedRewards)

  router.push({
    name: 'ChooseReward',
    params: {id: fundingId.value},
    // state: { selectedRewards: simplifiedRewards }
    // query: { selectedRewards: JSON.stringify(simplifiedRewards) }
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
}

#side-container {
  padding: 0;
  text-align: justify;
  transition: all 0.3s ease;
}

@media (min-width: 1200px) {
  #side-container {
    width: 41.66667%;
    height: auto;
    max-height: calc(100vh - 20px);
    overflow-y: visible;
    transition: width 0.3s ease;
  }

  #reward-container {
    //width: 100% !important;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
  }
}

.sticky-top {
  position: sticky;
  top: 20px;
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
  /*max-height: calc(100vh - 40px);
  overflow-y: auto;*/
  background-color: #fff;
  padding: 20px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  /*transition: width 0.3s ease;*/
}

.reward-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e7e7e7;
}

.reward-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.funding-period {
  font-size: 13px;
  color: #90949c;
  margin: 0;
}

.reward-item,
.selected-reward-item {
  width: 100%;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  margin-bottom: 15px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.reward-item {
  cursor: pointer;
}

.reward-item:hover {
  background-color: #f8f9fa;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
}

.reward-item.selected {
  border: 2px solid #00c4c4;
  background-color: #f0ffff;
}

.selected-reward-item {
  background-color: #f8f9fa;
  border: 1px solid #00c4c4;
}

.reward-price {
  font-size: 18px;
  font-weight: bold;
  color: #00c4c4;
  margin-bottom: 10px;
}

.reward-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.reward-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.reward-quantity {
  font-size: 13px;
  color: #90949c;
}

.quantity-left {
  font-weight: bold;
  color: #00c4c4;
  margin-right: 10px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.quantity-selector input {
  width: 60px;
  text-align: center;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
}

.btn-close {
  font-size: 0.8rem;
  color: #90949c;
}

#support-button {
  background-color: #00c4c4;
  border-color: #00c4c4;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
  padding: 15px;
  font-size: 18px;
  border-radius: 4px;
}

#support-button:hover:not(:disabled) {
  background-color: #00b2b2;
  border-color: #00b2b2;
}

#support-button:disabled {
  background-color: #cccccc;
  border-color: #cccccc;
  cursor: not-allowed;
}

.share-container {
  position: relative;
}

.share-modal {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  padding: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.share-modal button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  color: #333;
}

.share-modal button:hover {
  background-color: #e0e0e0;
}

.cursor-pointer {
  cursor: pointer;
}
</style>


