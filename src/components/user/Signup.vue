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
                  <div class="col-9">
                    <div class="form-floating">
                      <input type="email" class="form-control" name="email" id="email" v-model="state.email"
                             placeholder="name@example.com" required>
                      <label for="email" class="form-label">이메일</label>
                    </div>

                  </div>
                  <div class="col-3">
                    <button class="btn btn-primary btn-sm w-100" @click="sendEmail">인증 발송</button>
                    <div v-if="state.isLoading" class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  </div>
                <!-- 인증 키 입력 필드 (key가 존재할 경우 표시) -->
                <div class="col-12 text-start ms-3 small text-muted fw-light" style="margin: 0; padding: 0;">이메일 인증 후 회원가입을 할 수 있습니다.</div>
                <div class="col-9">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" v-model="state.verificationKey" placeholder="인증 키를 입력하세요"
                           required/>
                    <label for="verificationKey" class="form-label text-small">인증 코드</label>
                  </div>
                </div>
                <!-- 인증 버튼 -->
                <div v-if="state.key" class="col-3">
                  <button class="btn btn-primary btn-sm w-100" @click="verifyKey">인증 확인</button>
                </div>

                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input type="password" class="form-control" name="password" id="password"
                           v-model="state.password" placeholder="비밀번호" required>
                    <label for="password" class="form-label">비밀번호</label>
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-floating mb-3">
                    <input type="text" class="form-control" name="usernick" id="usernick"
                           v-model="state.userNick" placeholder="닉네임" required>
                    <label for="usernick" class="form-label">닉네임</label>
                  </div>
                </div>
                <div class="col-12">
                  <div v-if="state.isVerified" class="d-grid">
                    <!-- prevent 새로고침 방지 -->
                    <button class="btn btn-primary btn-lg"  @click.prevent="signup">회원가입
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div class="row">
              <div class="col-12">
                <!-- 소셜 회원가입 버튼 (구글, 네이버) -->
                <div class="mt-3 d-flex gap-3 flex-column">
                  <a href="#!" class="btn btn-secondary btn-lg" @click="googleSignup">
                    <span class="ms-2 fs-6 text-uppercase">구글 회원가입</span>
                  </a>
                  <a href="#!" class="btn btn-success btn-lg" @click="naverSignup">
                    <span class="ms-2 fs-6 text-uppercase">네이버 회원가입</span>
                  </a>
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
import {useRouter} from 'vue-router';
import {reactive} from 'vue';
import apiWrapper from '../../util/axios/axios';

export default {
  setup() {
    // Vue Router 사용 설정
    const router = useRouter();



    // 반응형 상태로 이메일, 비밀번호, 닉네임을 선언합니다.
    const state = reactive({
      email: '',
      password: '',
      userNick: '',
      key: null, // // 이메일 발송 후 서버에서 받은 key 저장
      verificationKey: "", // 사용자가 입력한 인증 키
      isVerified: false,
      isLoading: false,
    });

    // 로컬 회원가입 함수
    const signup = async () => {
      console.log("이메일:", state.email);
      console.log("비밀번호:", state.password);
      console.log("닉네임:", state.userNick);

      try {
        const postDataResult = await apiWrapper.postData('/api/signup', {
          email: state.email,
          password: state.password,
          userNick: state.userNick,
        });

        console.log('회원가입 요청 결과:', postDataResult);

        // 회원가입 성공 후 로그인 페이지로 이동
        router.push('/login');

      } catch (error) {
        console.error('API 호출 에러:', error);
      }
    };

    const sendEmail = async () => {
      try {
        state.isLoading = true; // 로딩 상태 활성화

        const response = await apiWrapper.postData("api/auth/email", {
          email: state.email,
        });

        // 성공적으로 이메일이 발송된 경우
        if (response.data.key) {
          state.key = response.data.key; // 인증 키 저장
          console.log(response.data.key);
          alert("인증 키가 이메일로 발송되었습니다.");
        }
      } catch (error) {
        // 서버에서 오류 응답을 반환한 경우
        if (error.response && error.response.status === 409) {
          alert("이미 존재하는 이메일입니다.");
        } else {
          // 기타 오류 처리
          console.error("이메일 발송 중 오류:", error);
          alert("이메일 발송에 실패했습니다.");
        }
      } finally {
        state.isLoading = false; // 로딩 상태 비활성화
      }
    };

    const verifyKey = () => {
      if (state.key === state.verificationKey) {
        state.isVerified = true; // 인증 성공 시 상태 변경
        alert("인증 성공!");
      } else {
        alert("인증 키가 일치하지 않습니다.");
      }
    };

    // 구글 회원가입
    const googleSignup = async () => {
      try {
        // 구글 OAuth 인증 URL로 리디렉션
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
      } catch (error) {
        console.error('Google signup error:', error);
      }
    };

    const naverSignup = async () => {
      try {
        // 동의창을 강제 표시하도록 `prompt` 파라미터 추가
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
      } catch (error) {
        console.error('Naver signup error:', error);
      }
    };


    // `toRefs`를 사용하여 개별 필드를 템플릿에 바인딩할 수 있도록 반환합니다.
    return {
      state,
      signup,
      googleSignup,
      naverSignup,
      verifyKey,
      sendEmail
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
