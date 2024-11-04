<template>
    <div class="d-flex flex-column align-items-center"> <!-- 전체를 중앙 정렬로 설정 -->
        <div class="d-flex align-items-center justify-content-center w-100 navigation">
            <!-- 네비게이션 바 -->
            <nav class="navbar navbar-expand-lg navbar-light bg-white">
                <div class="container justify-content-center"> <!-- 가운데 정렬 유지 -->
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link to="/admin/dashboard" class="nav-link"
                                :class="{ 'active': activeTab === 'home' }" @click="setActiveTab('home')">
                                <img :src="currentHomeIcon" :class="{ 'active-home-icon': activeTab === 'home' }"
                                    alt="Home Icon" />
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- 둥근 모서리를 가진 회색 탭 네비게이션 바 -->
            <div class="sub-navbar bg-light">
                <div class="container">
                    <ul class="navbar-nav flex-row">
                        <li class="nav-item">
                            <router-link to="/admin/member" class="nav-link" :class="{ active: activeTab === '회원관리' }"
                                @click="setActiveTab('회원관리')">
                                회원관리
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/report" class="nav-link" :class="{ active: activeTab === '신고게시판' }"
                                @click="setActiveTab('신고게시판')">
                                신고게시판
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/project" class="nav-link"
                                :class="{ active: activeTab === '프로젝트관리' }" @click="setActiveTab('프로젝트관리')">
                                프로젝트관리
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/comment" class="nav-link" :class="{ active: activeTab === '댓글관리' }"
                                @click="setActiveTab('댓글관리')">
                                댓글관리
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- 자식 컴포넌트를 렌더링하는 영역 -->
    <div class="content-container">
        <router-view />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import homeIcon from '../../assets/home.png';
import chooseHomeIcon from '../../assets/choose_home.png';

const activeTab = ref('home');
const homeIconSrc = homeIcon;
const chooseHomeIconSrc = chooseHomeIcon;

const currentHomeIcon = computed(() => {
    return activeTab.value === 'home' ? chooseHomeIconSrc : homeIconSrc;
});

function setActiveTab(tab) {
    activeTab.value = tab;
}
</script>

<style scoped>
.navigation {
    position: absolute;
    top: 22%;
}

/* 고정된 네비게이션 바와 서브 네비게이션 바 아래에 컨텐츠 위치 */
.content-container {
    padding-top: 120px;
}

.navbar {
    background-color: #f8f9fa;
    padding: 1rem;
    display: flex;
    justify-content: center;
    /* 네비게이션 바를 항상 가운데로 정렬 */
}

.nav-link {
    color: #333;
    font-weight: bold;
    margin: 0 10px;
}

.nav-link.active {
    color: #007bff;
}

/* 둥근 모서리를 가진 서브 네비게이션 바 스타일 */
.sub-navbar {
    padding: 0.5rem 1rem;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-radius: 20px;
    display: flex;
    justify-content: center;
}

.sub-navbar .container {
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.sub-navbar .nav-item {
    margin: 0 15px;
}

.sub-navbar .nav-link {
    color: #555;
}

.sub-navbar .nav-link.active {
    font-weight: bold;
    color: #007bff;
}
</style>