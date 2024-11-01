<template>
    <div>
        <!-- Navbar with Home Icon and Tabs -->
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <ul class="navbar-nav">
                    <!-- Home Icon Tab -->
                    <li class="nav-item">
                        <router-link to="/web/admin/dashboard" class="nav-link"
                            :class="{ 'active': activeTab === 'home' }" @click.native="setActiveTab('home')">
                            <img :src="homeIconSrc" :class="{ 'active-home-icon': activeTab === 'home' }"
                                alt="Home Icon" />
                        </router-link>
                    </li>
                    <!-- 회원관리 Tab -->
                    <li class="nav-item">
                        <router-link to="/web/admin/member" class="nav-link" :class="{ active: activeTab === '회원관리' }"
                            @click.native="setActiveTab('회원관리')">
                            회원관리
                        </router-link>
                    </li>
                    <!-- 신고게시판 Tab -->
                    <li class="nav-item">
                        <router-link to="/web/admin/report" class="nav-link" :class="{ active: activeTab === '신고게시판' }"
                            @click.native="setActiveTab('신고게시판')">
                            신고게시판
                        </router-link>
                    </li>
                    <!-- 프로젝트관리 Tab -->
                    <li class="nav-item">
                        <router-link to="/web/admin/project" class="nav-link"
                            :class="{ active: activeTab === '프로젝트관리' }" @click.native="setActiveTab('프로젝트관리')">
                            프로젝트관리
                        </router-link>
                    </li>
                    <!-- 댓글관리 Tab -->
                    <li class="nav-item">
                        <router-link to="/web/admin/comment" class="nav-link" :class="{ active: activeTab === '댓글관리' }"
                            @click.native="setActiveTab('댓글관리')">
                            댓글관리
                        </router-link>
                    </li>
                </ul>
            </div>
        </nav>

        <!-- Route View for child components -->
        <router-view />
    </div>
</template>

<script>
import homeIcon from "../../assets/home.png";

export default {
    name: "AdminPage",
    data() {
        return {
            activeTab: "home", // Default active tab
            homeIconSrc: homeIcon, // Use imported icon
        };
    },
    methods: {
        setActiveTab(tab) {
            this.activeTab = tab;
        },
    },
};
</script>

<style scoped>
.navbar-brand i {
    font-size: 1.5rem;
    color: #007bff;
}

.nav-link {
    color: #333;
}

.nav-link.active {
    font-weight: bold;
    color: #007bff;
}

.card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-weight: bold;
}

/* Style for the home icon when active */
.active-home-icon {
    filter: brightness(0) saturate(100%) invert(27%) sepia(86%) saturate(7480%) hue-rotate(195deg) brightness(91%) contrast(105%);
}
</style>