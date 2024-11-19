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
                <button class="btn btn-outline-primary w-100 mt-3">더 보기</button>
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
                            style="width: 50px; height: 50px; object-fit: cover;">
                        <div>
                            <h6 class="mb-1">{{ follow.name }}</h6>
                            <small>{{ follow.description }}</small>
                        </div>
                    </a>
                </div>
                <button class="btn btn-outline-primary w-100 mt-3">더 보기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const wishlist = ref([
    { image: 'https://via.placeholder.com/60', title: '프로젝트 1', category: '테크/가전' },
    { image: 'https://via.placeholder.com/60', title: '프로젝트 2', category: '패션/잡화' },
    { image: 'https://via.placeholder.com/60', title: '프로젝트 3', category: '푸드' },
]);

const followList = ref([
    { avatar: 'https://via.placeholder.com/50', name: '메이커 1', description: '테크 스타트업' },
    { avatar: 'https://via.placeholder.com/50', name: '메이커 2', description: '패션 디자이너' },
    { avatar: 'https://via.placeholder.com/50', name: '메이커 3', description: '푸드 크리에이터' },
]);
</script>

<style scoped>
.list-group-item:hover {
    background-color: #f8f9fa;
}
</style>