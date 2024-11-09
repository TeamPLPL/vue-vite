<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5">
        <div class="card border-2 rounded-4 border-light">
          <div class="card-body p-3 p-md-4 p-xl-5">
            <div class="row">
              <div class="col-12">
                <div class="mb-5">
                  <img src="../../assets/wadiz.png" style="width: 50%;">
                </div>
              </div>
            </div>
            <form action="#!">
              <div class="row gy-3 overflow-hidden">
                <div class="col-12">
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" name="email" id="email" v-model="email" placeholder="name@example.com" required>
                        <label for="email" class="form-label">이메일</label>
                    </div>
                    </div>
                    <div class="col-12">
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" name="password" id="password" v-model="password" placeholder="비밀번호" required>
                        <label for="password" class="form-label">비밀번호</label>
                    </div>
                    </div>
                <!-- <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" name="remember_me" id="remember_me">
                    <label class="form-check-label text-secondary" for="remember_me">
                      Keep me logged in
                    </label>
                  </div>
                </div> -->
                <div class="col-12">
                  <div class="d-grid">
                    <button class="btn btn-info btn-lg" @click="login">로그인</button>
                  </div>
                </div>
              </div>
            </form>
            <div class="row">
              <div class="col-12">
                <hr class="mt-5 mb-4 border-secondary-subtle">
                <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                  <a href="#!" class="link-secondary text-decoration-none" @click="emailSignup">이메일 회원가입</a>
                  <a href="#!" class="link-secondary text-decoration-none">Forgot password</a>
                </div>
              </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p class="mt-5 mb-4">소셜 로그인</p>
                    <!-- 소셜 로그인 버튼 (구글, 네이버) -->
                    <div class="d-flex gap-3 flex-column">
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
import { useAuthStore } from '../../util/store/authStore';

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
        // axios로 POST 요청을 보내고 응답을 받습니다.
        const response = await axios.post('/api/login', {
          email: state.email,
          password: state.password
        });

        console.log('POST 요청 결과:', response);

        // JWT 토큰이 응답 헤더에 있을 경우 이를 Pinia 스토어에 저장
        const token = response.headers['authorization'].split(" ")[1];
        authStore.setJwtToken(token); // JWT를 Pinia에 저장

        // 로그인 후 "/" 경로로 이동
        router.push('/');

      } catch (error) {
        console.error('API 호출 에러:', error);
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
      ...state,
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
    color: #ffffff; /* 텍스트를 흰색으로 설정 */
}
.btn-warning {
    color: #ffffff !important;
}
</style>