<template>
    <div class="row mb-4">
        <h4 class="fw-bold text-start mb-3">마이 리스트</h4>
        <div class="col-md-6 mb-3 mb-md-0">
            <!-- 찜 리스트 -->
            <div class="p-3">
                <h5 class="fw-bold text-start mb-3">위시 리스트</h5>
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action d-flex align-items-center"
                        v-for="(item, index) in wishlist" :key="index">
                        <img :src="item.image" alt="Project Image" class="me-3"
                            style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h6 class="mb-1">{{ item.title }}</h6>
                            <small>{{ item.category }}</small>
                        </div>
                    </a>
                </div>
                <button class="btn btn-outline-primary w-100 mt-3" @click="showWishlistModal">더 보기</button>
            </div>
        </div>
        <div class="col-md-6">
            <!-- 팔로우 리스트 -->
            <div class="p-3">
                <h5 class="fw-bold text-start mb-3">팔로우 리스트</h5>
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action d-flex align-items-center"
                        v-for="(follow, index) in followList" :key="index">
                        <img :src="follow.avatar" alt="Avatar" class="me-3 rounded-circle"
                            style="width: 60px; height: 60px; object-fit: cover;">
                        <div>
                            <h6 class="mb-1">{{ follow.name }}</h6>
                            <small>{{ follow.description }}</small>
                        </div>
                    </a>
                </div>
                <button class="btn btn-outline-primary w-100 mt-3" @click="showFollowListModal">더 보기</button>
            </div>
        </div>

        <!-- 위시리스트 모달 -->
        <div class="modal fade" id="wishlistModal" tabindex="-1" aria-labelledby="wishlistModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="wishlistModalLabel">위시 리스트</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group">
                            <li v-for="(item, index) in wishlist" :key="index" class="list-group-item">
                                <div class="d-flex align-items-center">
                                    <img :src="item.image" alt="Project Image" class="me-3"
                                        style="width: 60px; height: 60px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-1">{{ item.title }}</h6>
                                        <small>{{ item.category }}</small>
                                    </div>
                                    <button class="btn btn-warning btn-sm ms-auto">삭제</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- 팔로우 리스트 모달 -->
        <div class="modal fade" id="followListModal" tabindex="-1" aria-labelledby="followListModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="followListModalLabel">팔로우 리스트</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul class="list-group">
                            <li v-for="(follow, index) in followModalList" :key="index" class="list-group-item">
                                <div class="d-flex align-items-center">
                                    <img :src="follow.avatar" alt="Avatar" class="me-3 rounded-circle"
                                        style="width: 60px; height: 60px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-1">{{ follow.name }}</h6>
                                        <small>{{ follow.description }}</small>
                                    </div>
                                    <button class="btn btn-warning btn-sm ms-auto">삭제</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import apiWrapper from '../../../util/axios/axios';

const wishlist = ref([
    { image: 'https://via.placeholder.com/60', title: '프로젝트 1', category: '테크/가전' },
    { image: 'https://via.placeholder.com/60', title: '프로젝트 2', category: '패션/잡화' },
    { image: 'https://via.placeholder.com/60', title: '프로젝트 3', category: '푸드' },
]);

// const followList = ref([
//     { avatar: 'https://via.placeholder.com/50', name: '메이커 1', description: '테크 스타트업' },
//     { avatar: 'https://via.placeholder.com/50', name: '메이커 2', description: '패션 디자이너' },
//     { avatar: 'https://via.placeholder.com/50', name: '메이커 3', description: '푸드 크리에이터' },
// ]);

const followList = ref([]); // 최근 3명의 팔로우
const followModalList = ref([]); // 전체 팔로우

let wishlistModal, followListModal;

// 최근 팔로우 리스트 가져오기
const fetchLatestFollows = async () => {
    try {
        const response = await apiWrapper.getData('/api/follow/latest/3');
        followList.value = response || [];
        console.log('최신 팔로우 리스트:', followList.value);
    } catch (error) {
        console.error('최신 팔로우 리스트 조회 중 오류 발생:', error);
    }
};

// 전체 팔로우 리스트 가져오기
const fetchAllFollows = async () => {
    try {
        const response = await apiWrapper.getData('/api/follow/list');
        followModalList.value = response || [];
        console.log('전체 팔로우 리스트:', followModalList.value);
    } catch (error) {
        console.error('전체 팔로우 리스트 조회 중 오류 발생:', error);
    }
};

onMounted(() => {
    wishlistModal = new Modal(document.getElementById('wishlistModal'));
    followListModal = new Modal(document.getElementById('followListModal'));

    fetchLatestFollows();
});

const showWishlistModal = () => {
    wishlistModal.show();
};

const showFollowListModal = () => {
    if (followModalList.value.length === 0) {
        fetchAllFollows();
    }
    followListModal.show();
};
</script>

<style scoped>
.list-group-item:hover {
    background-color: #f8f9fa;
}

.button-group {
    flex-shrink: 0;
    white-space: nowrap;
}

.modal-body .list-group-item {
    padding: 0.75rem 1.25rem;
}

.modal-body .list-group-item>div {
    display: flex;
    align-items: center;
    width: 100%;
}

.modal-body .address-info {
    flex-grow: 1;
    text-align: left;
    padding-right: 1rem;
}

.modal-body .button-group {
    flex-shrink: 0;
    white-space: nowrap;
}

.modal-body .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
</style>