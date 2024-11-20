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
              <img v-if="!fileId" src="https://static.wadiz.kr/assets/icon/profile-icon-5.png" class="profile" style="cursor:pointer;"
                @click="profile">
              <img v-else :src="profileImage" class="profile" style="cursor:pointer;"
                   @click="profile">
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-light" @click="logout">로그아웃</button>
            </li>
          </template>

          <!-- 로그아웃 상태일 때 표시 -->
          <!-- <template v-else>
            <li class="nav-item">
              <button type="button" class="btn btn-light" @click="login">로그인</button>
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-light" @click="signup">회원가입</button>
            </li>
          </template> -->
          <template v-else-if="authStore.isInitialized">
            <li class="nav-item">
              <button @click="login">로그인</button>
            </li>
            <li class="nav-item">
              <button @click="signup">회원가입</button>
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
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../util/store/authStore.js';

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(!!localStorage.getItem('jwtToken'));

    // 작성자 : 신은호, 작성 내용 : 프로필 이미지
    const profileImage = ref(null); // 썸네일 URL
    const fileId = ref(null); // 파일 ID

    const fetchInitialProfileImage = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/profileimage`);
        const fileData = response; // 서버 응답이 바로 FileDTO 객체라고 가정
        console.log(response);
        profileImage.value = fileData.signedUrl; // 썸네일 URL 설정
        fileId.value = fileData.fileId; // fileId 저장
      } catch (error) {
        console.error("초기 썸네일 가져오기 실패:", error);
      }
    };

    const authStore = useAuthStore();

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
      // localStorage.removeItem('jwtToken'); // 로컬 스토리지에서 jwtToken 삭제
      // isLoggedIn.value = false; // 반응형 상태 업데이트
      authStore.logout();
      router.push('/'); // 로그아웃 후 메인 페이지로 이동
      window.location.reload(); // 새로고침 추가
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
      console.log('프로필 클릭됨');
      // if (authStore.isAuthenticated && authStore.canAccessSecurePage) {
      if (authStore.isAuthenticated && authStore.canAccessSecurePage) {
        console.log('인증됨, 페이지 이동 시도');
        router.push('/mywadiz/supporter');
      } else if (!authStore.isAuthenticated) {
        console.log('인증되지 않음');
        alert('로그인이 필요합니다.');
        router.push('/login');
      }
    }

    // 다른 탭이나 창에서 localStorage 변경 시 상태 업데이트, JWT 상태 확인
    onMounted(() => {
      window.addEventListener('storage', (event) => {
        if (event.key === 'jwtToken') {
          checkLoginStatus();
        }
      });
      fetchInitialProfileImage(); // 컴포넌트 초기화 시 썸네일 데이터 가져오기
    });

    return {
      authStore,
      isLoggedIn,
      login,
      signup,
      logout,
      main,
      createProject,
      profile,
      profileImage,
      fileId
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