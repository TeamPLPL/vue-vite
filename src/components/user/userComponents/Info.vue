<template>
  <div class="container mt-5">
    <!-- 설정 제목 -->
    <h4 class="fw-bold text-left">설정</h4>

    <!-- 설정 항목 리스트 2x2 레이아웃 -->
    <div class="row d-flex align-items-center mt-3">
      <!-- 첫 번째 줄: 프로필 정보 설정, 비밀번호 설정 -->
      <div class="col-6 mb-3" @click="modifyprofile">
        <a
            href="#"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="text-start">
            <h6 class="mb-1">프로필 정보 설정</h6>
            <small class="text-muted">프로필 사진 이름, 이메일, 휴대폰, SNS연동 등</small>
          </div>
          <span class="text-muted align-middle">&gt;</span>
        </a>
      </div>
      <div class="col-6 mb-3" @click="updatedpwd">
        <a
            href="#"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="text-start">
            <h6 class="mb-1">비밀번호 설정</h6>
            <small class="text-muted">비밀번호 재설정</small>
          </div>
          <span class="text-muted align-middle">&gt;</span>
        </a>
      </div>

      <!-- 두 번째 줄: 배송지 설정, 회원 탈퇴 -->
      <div class="col-6 mb-3">
        <a
            href="#"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
        >
          <div class="text-start">
            <h6 class="mb-1">배송지 설정</h6>
            <small class="text-muted">기본 배송지, 추가 배송지 설정</small>
          </div>
          <span class="text-muted align-middle">&gt;</span>
        </a>
      </div>
      <div class="col-6 mb-3 text-end" @click="dropoutuser">
        <a href="#" class="text-decoration-none text-dark fw-bold">회원 탈퇴</a>
      </div>
    </div>
  </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  setup() {
    const router = useRouter();

    // 프로필 정보 설정 이동
    const modifyprofile = () => {
      router.push('/mywadiz/info/modifyprofile')
    };

    // 비밀 번호 설정 이동
    const updatedpwd = () => {
      router.push('/mywadiz/info/updatepwd');
    };

    // 비밀 번호 설정 이동
    const dropoutuser = () => {
      router.push('/mywadiz/info/dropoutuser');
    };

    return {
      modifyprofile,
      updatedpwd,
      dropoutuser
    }
  }
}
</script>

<style scoped>
/* 설정 제목 왼쪽 정렬 */
.text-left {
  text-align: left;
}

/* list-group-item 요소 스타일링 */
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
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
