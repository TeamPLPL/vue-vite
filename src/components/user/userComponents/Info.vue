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
            <small class="text-muted">프로필 사진 이름, 이메일, SNS연동 등</small>
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
            <small v-if="!userInfo.provider"  class="text-muted">비밀번호 재설정 </small>
            <small v-else class="text-muted"><span v-if="userInfo.provider" style="color: red">* </span>SNS 가입자는 비밀번호를 변경할 수 없어요.</small>
          </div>
          <span class="text-muted align-middle">&gt;</span>
        </a>
      </div>

      <!-- 두 번째 줄: 배송지 설정, 회원 탈퇴 -->
      <div class="col-6 mb-3" @click="setDeliveryAddress">
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
import {onMounted, reactive} from "vue";
import apiWrapper from "../../../util/axios/axios.js";

export default {
  setup() {
    const router = useRouter();
    const userInfo = reactive({
      provider: ''
    });

    // 프로필 정보 설정 이동
    const modifyprofile = () => {
      router.push('/mywadiz/info/modifyprofile')
    };

    // 비밀 번호 설정 이동
    const updatedpwd = () => {
      // userInfo.provider가 존재하면 SNS 가입자임
      if (userInfo.provider) {
        alert('SNS 가입자는 비밀번호를 변경할 수 없어요.');
      } else {
        router.push('/mywadiz/info/updatepwd');
      }
    };

    // 배송지 설정 이동
    const setDeliveryAddress = () => {
      router.push('/mywadiz/info/deliveryAddress');
    }

    // 비밀 번호 설정 이동
    const dropoutuser = () => {
      router.push('/mywadiz/info/dropoutuser');
    };

    const fetchInitialUserInfo = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/user`);
        const data = response;
        console.log(data);

        // reactive 상태 업데이트
        userInfo.provider = data.provider;
      } catch (error) {
        console.error("사용자 정보 가져오기 실패", error);
      }
    }

    onMounted(() => {
      fetchInitialUserInfo();
    });

    return {
      modifyprofile,
      updatedpwd,
      setDeliveryAddress,
      dropoutuser,
      userInfo
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
