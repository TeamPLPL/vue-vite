<template>
    <div class="d-flex flex-column align-items-center">
        <div class="d-flex align-items-center justify-content-center w-100 navigation">
            <nav class="navbar navbar-expand-lg navbar-light bg-white">
                <div class="container justify-content-center">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link to="/admin/dashboard" class="nav-link"
                                :class="{ 'active': activeTab === 'home' }" 
                                @click="setActiveTab('home')">
                                <img :src="currentHomeIcon" alt="Home Icon" />
                            </router-link>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Sub-navbar -->
            <div class="sub-navbar bg-light">
                <div class="container">
                    <ul class="navbar-nav flex-row">
                        <li class="nav-item">
                            <router-link to="/admin/member" class="nav-link" 
                                :class="{ 'active-tab': activeTab === '회원관리' }" 
                                @click="setActiveTab('회원관리')">
                                회원관리
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/report" class="nav-link" 
                                :class="{ 'active-tab': activeTab === '신고게시판' }" 
                                @click="setActiveTab('신고게시판')">
                                신고게시판
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/project" class="nav-link" 
                                :class="{ 'active-tab': activeTab === '프로젝트관리' }" 
                                @click="setActiveTab('프로젝트관리')">
                                프로젝트관리
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/admin/comment" class="nav-link" 
                                :class="{ 'active-tab': activeTab === '댓글관리' }" 
                                @click="setActiveTab('댓글관리')">
                                댓글관리
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="content-container">
        <router-view />
    </div>
</template>

<script setup>
import { useAdminStore } from '../../util/store/adminStore';
const { activeTab, setActiveTab, currentHomeIcon } = useAdminStore();
</script>

<style scoped>
/* Sub-navbar 스타일 */
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
    padding: 0.5rem 1rem;
    border-radius: 10px;
    transition: background-color 0.3s, color 0.3s;
}

.sub-navbar .nav-item .nav-link.active-tab {
    background-color: #ffffff !important; /* 활성화된 탭 배경색 */
    font-weight: bold;
    color: #007bff !important; /* 활성화된 텍스트 색상 */
}

/* hover 효과 */
.sub-navbar .nav-link:hover {
    background-color: #f1f1f1;
    color: #333;
}

.navbar {
    background-color: #f8f9fa;
    padding: 1rem;
    display: flex;
    justify-content: center;
}
</style>
