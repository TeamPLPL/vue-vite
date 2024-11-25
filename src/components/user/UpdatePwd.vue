<template>
  <div class="container mt-5 password-settings-container">
    <!-- 비밀번호 설정 제목 -->
    <h4 class="fw-bold text-start">비밀번호 설정</h4>

    <!-- 현재 비밀번호 입력 -->
    <div class="form-group mt-4">
      <input
          type="password"
          class="form-control"
          placeholder="현재 비밀번호"
      />
    </div>

    <!-- 새 비밀번호 입력 -->
    <div class="form-group mt-3">
      <input
          v-model="password"
          type="password"
          class="form-control"
          placeholder="새 비밀번호"
          @input="validatePassword"
      />
    </div>

    <!-- 새 비밀번호 확인 입력 -->
    <div class="form-group mt-3">
      <input
          v-model="passwordConfirm"
          type="password"
          class="form-control"
          placeholder="새 비밀번호 확인"
          @input="validatePasswordMatch"
      />
      <small class="mt-2"
          :style="{ color: passwordError ? 'red' : isPasswordValid && isPasswordMatch ? 'blue' : 'initial' }"
          style="display: block; text-align: left; margin-top: 4px;"
      >
        영문, 숫자, 특수문자 !@#$%^&*+=-를 모두 조합한 8자 이상
      </small>
    </div>

    <!-- 확인 버튼 -->
    <div class="d-grid mt-4">
      <button
          :disabled="!(isPasswordValid && isPasswordMatch)"
          class="btn btn-primary"
      >
        확인
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      passwordConfirm: "",
      isPasswordValid: false,
      isPasswordMatch: false,
      passwordError: false,
    };
  },
  methods: {
    validatePassword() {
      const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*+=-]).{8,}$/;
      this.isPasswordValid = passwordPattern.test(this.password);
      this.passwordError = !this.isPasswordValid;
    },
    validatePasswordMatch() {
      this.isPasswordMatch = this.password === this.passwordConfirm;
    },
  },
};
</script>

<style scoped>
/* 페이지 컨테이너 너비 제한 */
.password-settings-container {
  max-width: 500px; /* 전체 넓이 제한 */
  margin: auto;
}

/* input 높이 및 스타일 */
.form-control {
  height: 45px; /* input 높이 조정 */
}
</style>
