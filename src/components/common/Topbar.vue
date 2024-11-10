<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarText">
        <span class="navbar-text">
          <img src="../../assets/wadiz.png" @click="main" style="width: 100px; height: auto; cursor: pointer; margin-left: 19.2px;">
        </span>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <img src="https://static.wadiz.kr/assets/icon/profile-icon-5.png" class="profile">
          </li>
          <li class="nav-item">
            <button type="button" class="btn btn-light" @click="login">로그인</button>
          </li>
          <li class="nav-item">
            <button type="button" class="btn btn-light" @click="logout">로그아웃</button>
          </li>
          <li class="nav-item">
            <button type="button" class="btn btn-light" @click="signup">회원가입</button>
          </li>
          <li class="nav-item">
            <button type="button" class="btn btn-primary">프로젝트 생성</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../util/store/authStore';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();

    // 라우터를 통해 '/login' 경로로 이동
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

    // logout,
    const logout = () => {
      authStore.setJwtToken(null); // jwtToken을 null로 설정
      axios.defaults.headers.common['Authorization'] = ''; // Authorization 헤더 초기화
      router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return {
      login,
      signup,
      logout,
      main
    };
  }
};



</script>


<style scoped>
.profile{
  width: 40px; /* 원하는 이미지 크기 */
  height: 40px; /* 원하는 이미지 크기 */
  border-radius: 50%; /* 원형으로 만듦 */
  object-fit: cover; /* 이미지가 원 안에 꽉 차게 조정 */
  margin-right: 19.2px
}
.nav-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>