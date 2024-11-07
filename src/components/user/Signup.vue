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
                                        <input type="email" class="form-control" name="email" id="email" v-model="email"
                                            placeholder="name@example.com" required>
                                        <label for="email" class="form-label">이메일</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-floating mb-3">
                                        <input type="password" class="form-control" name="password" id="password"
                                            v-model="password" placeholder="비밀번호" required>
                                        <label for="password" class="form-label">비밀번호</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-floating mb-3">
                                        <input type="text" class="form-control" name="usernick" id="usernick"
                                            v-model="userNick" placeholder="닉네임" required>
                                        <label for="usernick" class="form-label">닉네임</label>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="d-grid">
                                        <!-- prevent 새로고침 방지 -->
                                        <button class="btn btn-info btn-lg" @click.prevent="login">이메일 로그인</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="row">
                            <div class="col-12">
                                <hr class="mt-5 mb-4 border-secondary-subtle">
                                <div class="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                                    <a href="#!" class="link-secondary text-decoration-none">간편 이메일 회원가입</a>
                                    <a href="#!" class="link-secondary text-decoration-none">Forgot password</a>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <p class="mt-5 mb-4">소셜 로그인</p>
                                <div class="d-flex gap-3 flex-column">
                                    <a href="#!" class="btn btn-secondary btn-lg">
                                        <span class="ms-2 fs-6 text-uppercase">구글 로그인</span>
                                    </a>
                                    <a href="#!" class="btn btn-success btn-lg">
                                        <span class="ms-2 fs-6 text-uppercase">네이버 로그인</span>
                                    </a>
                                    <a href="#!" class="btn btn-warning btn-lg">
                                        <span class="ms-2 fs-6 text-uppercase">카카오 로그인</span>
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
import { reactive, toRefs } from 'vue';
import apiWrapper from '../../util/axios/axios';

export default {
  setup() {
    // 반응형 상태로 이메일, 비밀번호, 닉네임을 선언합니다.
    const state = reactive({
      email: '',
      password: '',
      userNick: '',
    });

    // 서버로 이메일과 비밀번호 데이터를 전달하는 함수
    const login = async () => {
      console.log("이메일:", state.email);
      console.log("비밀번호:", state.password);
      console.log("닉네임:", state.userNick);
      
      try {
        const postDataResult = await apiWrapper.postData('/api/signup', {
          email: state.email,
          password: state.password,
          userNick: state.userNick,
        });
        console.log('POST 요청 결과:', postDataResult);
      } catch (error) {
        console.error('API 호출 에러:', error);
      }
    };

    // `toRefs`를 사용하여 개별 필드를 템플릿에 바인딩할 수 있도록 반환합니다.
    return {
      ...toRefs(state),
      login
    };
  }
};
</script>

<style scoped></style>
