<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
        <div class="card border-2 rounded-4 border-light">
          <div class="card-body p-3 p-md-4 p-xl-4">
            <div class="row">
              <div class="col-12">
                <div class="mb-3">
                  <img src="../../assets/wadiz.png" style="width: 50%;">
                </div>
              </div>
            </div>
            <form action="#!">
              <div class="row gy-3 overflow-hidden">
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input type="email" class="form-control" name="email" id="email" v-model="state.email"
                      placeholder="name@example.com" required>
                    <label for="email" class="form-label">이메일</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input type="password" class="form-control" name="password" id="password" v-model="state.password"
                      placeholder="비밀번호" required>
                    <label for="password" class="form-label">비밀번호</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="d-grid">
                    <button class="btn btn-primary btn-lg" @click.prevent="login">로그인</button>
                  </div>
                </div>
              </div>
            </form>
            <div class="row">
              <div class="col-12">
                <hr class="mt-4 mb-4 border-secondary-subtle">
                <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                  <a href="#!" class="link-secondary text-decoration-none" @click="emailSignup">이메일 회원가입</a>
                  <a href="#!" class="link-secondary text-decoration-none">Forgot password</a>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <!-- 소셜 로그인 버튼 (구글, 네이버) -->
                <div class="mt-4 d-flex gap-3 flex-column">
                  <a href="#!" class="btn btn-secondary btn-lg" @click="googleLogin">
                    <span class="ms-2 fs-6 text-uppercase">구글 로그인</span>
                  </a>
                  <a href="#!" class="btn btn-success btn-lg" @click="naverLogin">
                    <span class="ms-2 fs-6 text-uppercase">네이버 로그인</span>
                  </a>
                  <!-- <a href="#!" class="btn btn-warning btn-lg">
                      <span class="ms-2 fs-6 text-uppercase">카카오 로그인</span>
                  </a> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import axios from 'axios'; // axios를 직접 임포트합니다.
import { useAuthStore } from '../../util/store/authStore'

export default {
  setup() {
    // Vue Router와 Pinia Auth 스토어 사용 설정
    const router = useRouter();
    const authStore = useAuthStore();

    // 반응형 상태로 이메일과 비밀번호를 선언합니다.
    const state = reactive({
      email: '',
      password: ''
    });

    // 서버로 이메일과 비밀번호 데이터를 전달하는 함수
    const login = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/login', {
          email: state.email,
          password: state.password,
        });

        // Authorization 헤더가 정상적으로 오는지 체크
        if (response.headers['authorization']) {
          const token = response.headers['authorization'].split(' ')[1];
          console.log(token);

          // AuthStore 설정
          authStore.setJwtToken(token);
          authStore.setSecurePageAccess(true);
          authStore.initializeStore(); // initializeStore를 마지막에 호출

          // 로컬 스토리지에 토큰 저장
          // localStorage.setItem('jwtToken', token);

          // 로그인 후 메인 페이지로 이동
          router.push('/');
        } else {
          console.error('JWT 토큰을 찾을 수 없습니다.');
        }
      } catch (error) {
        // 로그인 실패 시 경고 메시지와 페이지 리로드
        alert('로그인에 실패하였습니다.');
        console.error('API 호출 에러:', error);

        // 에러 발생 시 스토어 초기화
        authStore.setJwtToken(null);
        localStorage.removeItem('jwtToken');
        authStore.setSecurePageAccess(false);
        // window.location.reload();
        router.push('/login');
      }
    };

    const emailSignup = async () => {
      router.push('/signup');
    };

    // 구글 로그인
    const googleLogin = async () => {
      try {
        // 구글 OAuth 인증 URL로 리디렉션
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
      } catch (error) {
        console.error('Google login error:', error);
      }
    };

    // 네이버 로그인
    const naverLogin = async () => {
      try {
        // 네이버 OAuth 인증 URL로 리디렉션
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
      } catch (error) {
        console.error('Naver login error:', error);
      }
    };

    return {
      state,
      login,
      googleLogin,
      naverLogin,
      emailSignup
    };
  }
};
</script>


<style scoped>
.btn-info {
  color: #ffffff;
  /* 텍스트를 흰색으로 설정 */
}

.btn-warning {
  color: #ffffff !important;
}
</style>