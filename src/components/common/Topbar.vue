<template>
  <nav class="navbar navbar-expand-sm">
    <div class="container-sm">
      <div class="navbar-collapse" id="navbarText">
        <span class="navbar-text">
          <img src="../../assets/wadiz.png" @click="main" style="width: 100px; height: auto; cursor: pointer; margin-left: 19.2px;">
        </span>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- 로그인 상태일 때 표시 -->
          <template v-if="isLoggedIn">
            <li class="nav-item">
              <img src="https://static.wadiz.kr/assets/icon/profile-icon-5.png" class="profile" style="cursor:pointer;" @click="profile">
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
import apiWrapper from "../../util/axios/axios.js"
import { ref,  onMounted } from 'vue';

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

    const createProject = () => {
      if (isLoggedIn.value) {
        // 프로젝트 생성 여부 확인
        if (confirm('프로젝트를 생성하시겠습니까?')) {
          const startProject = async () => {
            try {
              // 확인 후, 서버로 프로젝트 생성 요청
              const response = await apiWrapper.getData('/api/studio/start');
              const projectId = response.projectId;

              // 응답으로 projectId 반환 후, 프로젝트 관리 페이지로 이동
              console.log('API 응답:', response);
              console.log('projectId 응답:', projectId);
              alert(`프로젝트가 생성되었습니다! 프로젝트 ID: ${projectId}`);
              router.push(`/studio/${projectId}/project`);
            } catch (error) {
              console.error('프로젝트 시작 오류:', error);
            }
          };

          startProject();
        } else {
          console.log('프로젝트 생성 취소');
        }
      } else {
        router.push('/login');
      }
    };

    const profile = () => {
      if (isLoggedIn.value) {
        router.push('/mywadiz/supporter')
      }
    }

    // 다른 탭이나 창에서 localStorage 변경 시 상태 업데이트
    onMounted(() => {
      window.addEventListener('storage', (event) => {
        if (event.key === 'jwtToken') {
          checkLoginStatus();
        }
      });
    });

    return {
      isLoggedIn,
      login,
      signup,
      logout,
      main,
      createProject,
      profile
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