<template>
  <!-- Persistent Cards Section -->
  <div class="container">
    <div class="row">
      <!-- 회원 현황 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">회원 현황</h5>
            <p class="card-text">총 회원 수 : 576명</p>
            <p class="card-text">오늘 가입자 수 : 25명</p>
            <p class="card-text">오늘 탈퇴자 수 : 4명</p>
            <button class="btn btn-outline-secondary" @click="handleClick('회원관리', '/admin/member')">회원관리</button>
          </div>
        </div>
      </div>

      <!-- 신고 현황 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">신고 현황</h5>
            <p class="card-text">총 신고 수 : 24건</p>
            <p class="card-text">오늘 신고 건수 : 1건</p>
            <p class="card-text">오늘 정지 건수 : 0건</p>
            <p class="card-text">오늘 강제탈퇴 건수 : 0건</p>
            <button class="btn btn-outline-secondary" @click="handleClick('신고게시판', '/admin/report')">신고게시판</button>
          </div>
        </div>
      </div>

      <!-- 프로젝트 현황 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">프로젝트 현황</h5>
            <p class="card-text">총 프로젝트 수 : 24개</p>
            <p class="card-text">검토중인 프로젝트 수 : 7개</p>
            <p class="card-text">승인된 프로젝트 수 : 9개</p>
            <p class="card-text">반려된 프로젝트 수 : 8개</p>
            <button class="btn btn-outline-secondary" @click="handleClick('프로젝트관리', '/admin/project')">프로젝트관리</button>
          </div>
        </div>
      </div>

      <!-- 댓글 현황 -->
      <div class="col-md-6 mb-4">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">댓글 현황</h5>
            <p class="card-text">총 댓글 수 : 128개</p>
            <p class="card-text">오늘 작성된 댓글 수 : 18개</p>
            <p class="card-text">오늘 삭제된 댓글 수 : 0개</p>
            <button class="btn btn-outline-secondary" @click="handleClick('댓글관리', '/admin/comment')">댓글관리</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from '../../util/store/adminStore';
import { useRouter } from 'vue-router';

const { setActiveTab } = useAdminStore();
const router = useRouter();

function handleClick(tab, path) {
  setActiveTab(tab); // Pinia 상태 업데이트
  router.push(path); // 라우트 이동
}
</script>

<style scoped>
.card {
  height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-weight: bold;
}
</style>
