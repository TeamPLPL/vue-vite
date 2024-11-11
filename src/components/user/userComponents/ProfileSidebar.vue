<template>
  <!-- Sidebar -->
  <div class="col-lg-3 border-end d-none d-lg-block">
    <div class="d-flex flex-column align-items-center p-3">
      <!-- Same-line Buttons for 서포터 and 메이커 -->
      <div class="d-flex mb-3">
        <button class="btn btn-outline-secondary me-2" @click="mySupporter">서포터</button>
        <button class="btn btn-outline-secondary" @click="myMaker">메이커</button>
      </div>

      <!-- Profile Section -->
      <img src="https://static.wadiz.kr/assets/icon/profile-icon-5.png" class="rounded-circle mb-2" style="width: 80px;" alt="Profile Icon">
      <span class="badge bg-secondary" style="font-size: 1rem; padding: 10px;">아기광어 님</span>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const myMaker = async () => {
      router.push('/mywadiz/maker');
    };

    const mySupporter = async () => {
      router.push('/mywadiz/supporter');
    };


    return {
      myMaker,
      mySupporter
    };
  }
};
</script>



<style scoped>

</style>