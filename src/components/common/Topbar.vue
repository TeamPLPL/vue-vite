<template>
  <nav class="navbar navbar-expand-sm">
    <div class="container-sm">
      <span class="navbar-text">
        <img src="../../assets/wadiz.png" @click="main"
          style="width: 100px; height: auto; cursor: pointer; margin-left: 19.2px;">
      </span>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
        aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
        <ul class="navbar-nav align-items-end">
          <!-- 로그인 상태일 때 표시 -->
          <template v-if="isLoggedIn">
            <li class="nav-item">
              <img src="https://static.wadiz.kr/assets/icon/profile-icon-5.png" class="profile" @click="profile">
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-light" @click="logout">로그아웃</button>
            </li>
          </template>

          <!-- 로그아웃 상태일 때 표시 -->
          <template v-else>
            <li class="nav-item">
              <button type="button" class="btn btn-light" @click="login">로그인</button>
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-light" @click="signup">회원가입</button>
            </li>
          </template>

          <li class="nav-item">
            <button type="button" class="btn btn-primary" @click="createProject">프로젝트 생성</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(!!localStorage.getItem('jwtToken'));

    // 로그인 상태를 확인하는 함수
    const checkLoginStatus = () => {
      isLoggedIn.value = !!localStorage.getItem('jwtToken');
    };

    // 라우터를 통해 '/' 경로로 이동
    const main = () => {
      router.push('/');
    };

    // 라우터를 통해 '/login' 경로로 이동
    const login = () => {
      router.push('/login');
    };

    // 라우터를 통해 '/signup' 경로로 이동
    const signup = () => {
      router.push('/signup');
    };

    // 로그아웃 함수
    const logout = () => {
      localStorage.removeItem('jwtToken'); // 로컬 스토리지에서 jwtToken 삭제
      isLoggedIn.value = false; // 반응형 상태 업데이트
      router.push('/'); // 로그아웃 후 메인 페이지로 이동
    };

    // 다른 탭이나 창에서 localStorage가 변경될 때 이를 감지하여 상태를 업데이트
    onMounted(() => {
      window.addEventListener('storage', (event) => {
        if (event.key === 'jwtToken') {
          checkLoginStatus();
        }
      });
    });

    const createProject = () => {
      if (isLoggedIn) {
        router.push('/project/create'); // 로그인된 상태에서의 경로
      } else {
        router.push('/login'); // 로그아웃 상태에서는 로그인 페이지로
      }
    };

    return {
      isLoggedIn,
      login,
      signup,
      logout,
      main,
      createProject,
    };
  }
};
</script>


<style scoped>
.profile {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 19.2px;
}

.nav-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}


/* */
@media (max-width: 575.98px) {
  .navbar-nav {
    width: 100%;
  }

  .nav-item {
    width: 100%;
    margin-bottom: 10px;
  }

  .navbar-collapse {
    text-align: right;
  }

  .btn {
    width: 100%;
    max-width: none;
  }

  .profile {
    margin: 0;
    display: block;
  }
}
</style>