<template>
  <div class="container mt-5 settings-container">
    <!-- 설정 제목 -->
    <h4 class="fw-bold text-left">설정</h4>

    <!-- 설정 항목 리스트 -->
    <div class="list-group mt-3">
      <!-- 설정 항목 반복 출력 -->
      <a
          v-for="(item, index) in settings"
          :key="index"
          href="#"
          class="list-group-item list-group-item-action d-flex justify-content-between align-items-center custom-border"
      >
        <div class="text-left">
          <h6 class="mb-1">{{ item.title }}</h6> <!-- 텍스트 크기 줄임 -->
          <small class="text-muted">{{ item.description }}</small>
        </div>
        <span class="text-muted align-middle">&gt;</span>
      </a>
    </div>

    <!-- 회원 탈퇴 -->
    <div class="text-end mt-4">
      <a href="#" class="text-decoration-none text-dark fw-bold">회원 탈퇴</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      settings: [
        {
          title: "프로필 정보 설정",
          description: "프로필 사진 이름, 이메일, 휴대폰, SNS연동 등"
        },
        {
          title: "비밀번호 설정",
          description: "비밀번호 재설정"
        },
        {
          title: "배송지 설정",
          description: "기본 배송지, 추가 배송지 설정"
        }
      ]
    };
  }
};
</script>

<style scoped>
/* 설정 컨테이너의 최대 너비를 제한 */
.settings-container {
  max-width: 600px; /* 최대 너비를 조금 더 넓힘 */
  margin: auto; /* 가운데 정렬 */
}

/* 설정 제목 왼쪽 정렬 */
.text-left {
  text-align: left;
}

/* list-group-item 요소 스타일링 */
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0; /* 상하 패딩 조정 */
}

/* 하단 보더만 남기고 제거 */
.custom-border {
  border: none;
  border-bottom: 1px solid #dee2e6; /* 하단 보더만 표시 */
}

/* 제목 텍스트 크기 줄임 */
h6 {
  font-size: 1rem;
  font-weight: bold;
}

/* ">" 요소를 세로 가운데 정렬 */
.align-middle {
  display: inline-flex;
  align-items: center;
}
</style>
