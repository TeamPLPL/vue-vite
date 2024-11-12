<template>
  <div class="container mt-5">
    <!-- 회원 탈퇴 안내 -->
    <h4 class="fw-bold text-start">회원 탈퇴</h4>
    <p class="text-start">와디즈를 이용하시는데 불편함이 있으셨으면, 아래 방법을 한번 이용해보세요.</p>

    <!-- 불편사항 안내 박스 -->
    <div class="border p-3 bg-light text-start">
      <p><strong>문자 메시지 / 이메일 수신이 불편하신가요?</strong><br>
        수신거부는 MY 정보설정 > <a href="#">기본 정보 설정</a>에서 하실 수 있습니다.</p>

      <p><strong>투자회원 가입 시 업로드한 개인 신분증 때문에 불편하신가요?</strong><br>
        와디즈에서는 실명인증 확인 후, 24시간 이내 즉시 파기하고 있습니다.</p>

      <p><strong>기타 불편한 사항이 있으시면 언제든 와디즈에게 알려주세요.</strong><br>
        <a href="#">와디즈에 문의하기</a> | 1661-9056 | 카카오톡 친구추가 ‘와디즈’ | info@wadiz.kr</p>
    </div>

    <!-- 본인 확인 -->
    <h4 class="fw-bold mt-4 text-start">본인 확인</h4>
    <p class="text-muted text-start">안전한 탈퇴를 위해 본인 인증 절차를 진행합니다. 본인확인하기 버튼을 클릭해주세요.</p>

    <!-- 본인 확인 버튼 -->
    <div class="d-grid mb-3">
      <button class="btn btn-primary w-50 ms-0" @click="verifyIdentity">본인 확인하기</button>
    </div>

    <!-- 회원 탈퇴 버튼 -->
    <div class="d-grid">
      <button class="btn btn-danger w-50 ms-0" :disabled="!isVerified">회원 탈퇴</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVerified: false // 본인 확인 여부
    };
  },
  methods: {
    verifyIdentity() {
      // 본인 확인 절차를 위한 로직 (예: 인증 API 호출)
      // 여기서는 예제로 바로 본인 확인을 완료하는 것으로 설정
      this.isVerified = true;
    }
  }
};
</script>

<style scoped>
/* 페이지 컨테이너 너비 제한 */
.container {
  max-width: 700px;
  margin: auto;
}

/* 모든 텍스트를 왼쪽 정렬 */
.text-start {
  text-align: left;
}
</style>
