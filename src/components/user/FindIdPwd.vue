<template>
  <div class="container mt-5 find-container">
    <!-- 제목 -->
    <h3 class="fw-bold text-start">아이디·비밀번호 찾기</h3>

    <!-- 네비게이션 탭 -->
    <ul class="nav nav-tabs mt-3">
      <li class="nav-item">
        <a
            class="nav-link"
            :class="{ active: activeTab === 'findId' }"
            href="#"
            @click.prevent="activeTab = 'findId'"
        >아이디 찾기</a>
      </li>
      <li class="nav-item">
        <a
            class="nav-link"
            :class="{ active: activeTab === 'findPassword' }"
            href="#"
            @click.prevent="activeTab = 'findPassword'"
        >비밀번호 찾기</a>
      </li>
    </ul>

    <!-- 콘텐츠 영역 -->
    <div class="tab-content mt-4 p-4 border rounded bg-light">
      <!-- 아이디 찾기 페이지 -->
      <div v-if="activeTab === 'findId'">
        <p>와디즈는 이메일을 아이디로 사용합니다.<br>소유하고 계신 계정을 입력해보세요.<br>가입여부를 확인해드립니다.</p>
        <div class="form-group mt-3">
          <input
              type="email"
              class="form-control"
              placeholder="이메일 계정"
              v-model="email"
          />
        </div>
        <button class="btn btn-primary mt-3 w-100" @click="submitId">확인</button>
      </div>

      <!-- 비밀번호 찾기 페이지 -->
      <div v-else-if="activeTab === 'findPassword'">
        <p>가입하셨던 이메일 계정을 입력하시면,<br>비밀번호를 새로 만들 수 있는 링크를 이메일로 발송해드립니다.</p>
        <div class="form-group mt-3">
          <input
              type="email"
              class="form-control"
              placeholder="이메일 계정"
              v-model="email"
          />
        </div>
        <button class="btn btn-primary mt-3 w-100" @click="submitPassword">링크 발송</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'findId', // 현재 활성화된 탭 (기본: 아이디 찾기)
      email: '' // 이메일 입력 값
    };
  },
  methods: {
    submitId() {
      // 아이디 찾기 제출 로직
      console.log("아이디 찾기 요청:", this.email);
    },
    submitPassword() {
      // 비밀번호 찾기 제출 로직
      console.log("비밀번호 찾기 요청:", this.email);
    }
  }
};
</script>

<style scoped>
/* 페이지 컨테이너 너비 제한 */
.find-container {
  max-width: 600px; /* 최대 너비를 600px로 확장 */
  margin: auto;
}

/* 네비게이션 탭 스타일 */
.nav-link {
  color: #666;
}
.nav-link.active {
  color: #007bff; /* 활성화된 탭 색상 */
  border-color: #007bff; /* 탭 아래 보더 색상 */
}

/* 버튼 스타일 */
.btn-primary {
  background-color: #00c2c7; /* 버튼 색상 */
  border-color: #00c2c7;
}
</style>
