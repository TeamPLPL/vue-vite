<template>
  <div class="container mt-2  profile-settings-container">
    <!-- 프로필 정보 설정 -->
    <div class="text-start">
      <h4 class="fw-bold">프로필 정보 설정</h4>
      <p class="text-muted mt-1">프로필 사진</p>
    </div>

    <!-- 프로필 사진 -->
    <div class="d-flex flex-column align-items-center mb-4">
      <img
          src="https://via.placeholder.com/80"
          alt="프로필 사진"
          class="rounded-circle"
          :style="{ width: profileImageSize + 'px', height: profileImageSize + 'px' }"
      />
      <button class="btn btn-outline-primary btn-sm mt-3">사진 바꾸기</button>
    </div>

    <!-- 기본 정보 설정 -->
    <div class="text-start">
      <h5 class="fw-bold">기본 정보 설정</h5>
    </div>

    <!-- 이름 입력 -->
    <div class="form-group mt-3">
      <input type="text" class="form-control custom-input" placeholder="이름을 입력하세요" />
    </div>

    <!-- 이메일 변경 -->
    <div class="input-group mt-3">
      <input type="email" class="form-control custom-input" placeholder="76768140sa@gmail.com" disabled />
      <button class="btn btn-secondary">변경</button>
    </div>

    <!-- 전화번호 변경 -->
    <div class="input-group mt-3">
      <input type="text" class="form-control custom-input" placeholder="01027385539" disabled />
      <button class="btn btn-secondary">변경</button>
    </div>

    <!-- SNS 연동 -->
    <div class="text-start">
      <h5 class="fw-bold mt-4">SNS 연동</h5>
      <p class="text-muted">카카오를 연동하시면 피드에서 친구의 활동을 확인할 수 있어요</p>
    </div>

    <!-- SNS 버튼 (배지 크기 증가) -->
    <div class="d-flex mb-4">
      <span class="badge bg-success me-2 custom-badge">Naver</span>
      <span class="badge bg-light text-dark border custom-badge">Google</span>
    </div>

    <!-- 취소 및 확인 버튼 -->
    <div class="d-flex justify-content-between">
      <button class="btn btn-secondary w-48">취소</button>
      <button class="btn btn-primary w-48">확인</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileImageSize: 150 // 프로필 사진 크기
    };
  }
};
</script>

<style scoped>
/* 페이지 컨테이너 너비 제한 */
.profile-settings-container {
  max-width: 500px; /* 전체 넓이 줄임 */
  margin: auto;
}

/* 커스텀 input 스타일 */
.custom-input {
  height: 45px; /* input 높이 조정 */
  background-color: #ffffff; /* 배경을 흰색으로 설정 */
}

/* 버튼 너비 조정 */
.w-48 {
  width: 48%; /* 버튼 간격을 좁히기 위해 너비를 48%로 설정 */
}

/* 배지 크기 조정 */
.custom-badge {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
}
</style>
