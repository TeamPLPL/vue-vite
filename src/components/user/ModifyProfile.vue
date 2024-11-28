<template>
  <div class="container mt-2  profile-settings-container">
    <!-- 프로필 정보 설정 -->
    <div class="text-start">
      <h4 class="fw-bold">프로필 정보 설정</h4>
      <p class="text-muted mt-1">프로필 사진</p>
    </div>

    <!-- 프로필 사진 -->
    <div class="d-flex flex-column align-items-center mb-4">
      <img v-if="!profileImage"
           src="https://static.wadiz.kr/assets/icon/profile-icon-5.png"
           alt="프로필 사진"
           class="rounded-circle"
           style="width: 180px; height: 180px; object-fit: cover;"
      />
      <img v-else
           :src="profileImage"
           alt="프로필 사진"
           class="rounded-circle"
           style="width: 180px; height: 180px; object-fit: cover;"
      />
      <label for="file-upload" class="custom-file-upload btn btn-outline-primary btn-sm mt-3">
        사진 바꾸기
      </label>
      <input id="file-upload" type="file" style="display: none;" @change="onImageUpload">
    </div>

    <!-- 기본 정보 설정 -->
    <div class="text-start">
      <h5 class="fw-bold">기본 정보 설정</h5>
    </div>

    <!-- 이름 출력 -->
    <div class="form-group mt-3">
      <span v-if="!userInfo.userName" class="text-muted small d-block text-start mb-2" >이름은 한 번 입력하면 바꿀 수 없어요.</span>
      <div class="row align-items-center">
        <div class="col-3 ">
          <h2 class="mb-0 ms-0 fs-5"><span class="badge text-bg-primary w-100" >이름</span></h2>
        </div>
        <div class="col-9">
          <input type="text" class="form-control custom-input" v-model="userInfo.userName" placeholder="이름을 입력하세요" :disabled="isNameDisabled"/>
        </div>
      </div>
    </div>

    <!-- 이메일 변경 X -->
    <div class="form-group mt-3">
      <div class="row align-items-center">
        <div class="col-3 ">
          <h2 class="mb-0 ms-0 fs-5"><span class="badge text-bg-primary w-100">이메일</span></h2>
        </div>
        <div class="col-9">
          <input type="email" class="form-control custom-input" v-model="userInfo.email" placeholder="이메일" disabled/>
        </div>
      </div>
    </div>

    <!-- 닉네임 변경 o -->
    <div class="form-group mt-3">
      <div class="row align-items-center">
        <div class="col-3 ">
          <h2 class="mb-0 ms-0 fs-5"><span class="badge text-bg-primary w-100">닉네임</span></h2>
        </div>
        <div class="col-9">
          <input type="text" class="form-control custom-input" v-model="userInfo.userNick" placeholder="닉네임을 입력하세요." />
        </div>
      </div>
    </div>

    <!-- 메이커 자기소개 변경 -->
    <div class="form-group mt-3">
      <div class="row align-items-center">
        <div class="col-3 ">
          <h2 class="mb-0 ms-0 fs-5"><span class="badge text-bg-primary w-100">메이커 소개</span></h2>
        </div>
        <div class="col-9">
          <input type="email" class="form-control custom-input" v-model="userInfo.userContent" placeholder="메이커를 소개해보세요." />
        </div>
      </div>
    </div>

    <!--    &lt;!&ndash; 전화번호 변경 &ndash;&gt;-->
    <!--    <div class="input-group mt-3">-->
    <!--      <input type="text" class="form-control custom-input" placeholder="전화번호" disabled />-->
    <!--    </div>-->

    <!-- SNS 가입여부 -->
    <div class="text-start mt-4">
      <h5 class="fw-bold mt-4">SNS 가입여부</h5>
      <p class="text-muted small">Naver, Google 연동을 확인할 수 있어요.</p>
    </div>

    <hr>

    <!-- SNS 버튼 (배지 크기 증가) -->
    <div class="d-flex mb-4">
      <span v-if="userInfo.provider === 'naver'" class="badge bg-success me-2 custom-badge">Naver</span>
      <span v-if="userInfo.provider === 'google'" class="badge bg-light text-dark border custom-badge">Google</span>
      <span v-if="!userInfo.provider" class="small">❌연동된 SNS가 없습니다.</span>
    </div>

    <!-- 비밀번호 검증 -->
<!--    <div class="form-group mt-3">
      <div class="row align-items-center">
        <div class="col-9 ">
          <input type="password" class="form-control custom-input" v-model="userInfo.password" placeholder="비밀번호를 입력하세요."/>
        </div>
        <div class="col-3">
          <button class="btn btn-outline-primary fs-7" style="font-size: 11px;" @click="verifyEmail">비밀번호 확인</button>
        </div>
      </div>
    </div>-->

    <div class="text-start mt-4">
      <h5 class="fw-bold mt-4">이메일 인증 <span style="color: red">*</span> </h5>
      <p class="text-muted small">등록된 이메일 인증 후 수정이 가능해요.</p>
    </div>

    <!-- 이메일 인증  -->

    <div class="form-group mt-3">
      <div class="row align-items-center">
        <div class="col-8">
          <input type="password" class="form-control custom-input" v-model="state.verificationKey" placeholder="인증 번호를 입력하세요."/>
        </div>
        <div class="col-2">
          <button class="btn btn-outline-primary fs-7" style="font-size: 11px;" @click="sendEmail">인증 발송</button>
        </div>
        <div class="col-2">
          <button class="btn btn-outline-primary fs-7" style="font-size: 11px;" @click="verifyKey">인증 확인</button>
        </div>
      </div>
    </div>

    <!-- 취소 및 확인 버튼 -->
    <div class="d-flex justify-content-between mt-4 mb-5">
      <button class="btn btn-secondary w-48" @click="supportPage">취소</button>
      <button class="btn btn-primary w-48" :disabled="!state.isVerified" @click="updateUserInfo">저장</button>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref, watch } from "vue";
import apiWrapper from "../../util/axios/axios.js";
import router from "../../util/router/router.js";

export default {
  name: "ModifyProfile",
  data() {
    return {
      profileImageSize: 170 // 프로필 사진 크기
    };
  },
  setup() {
    const profileImage = ref(null); // 썸네일 URL
    const fileId = ref(null); // 파일 ID
    const fileInput = ref(null); // input 요소에 대한 ref
    const userInfo = reactive({
      email: '',
      userName: '',
      userNick: '',
      provider: '',
      password: '',
      userContent: '',
    });
    const isNameDisabled = ref(false);

    const state = reactive({
      email: '',
      key: null, // // 이메일 발송 후 서버에서 받은 key 저장
      verificationKey: "", // 사용자가 입력한 인증 키
      isVerified: false,
      isLoading: false,
    });

    // 라우터를 통해 '/mywadiz/support' 경로로 이동
    const supportPage = () => {
      if (window.confirm("마이페이지로 돌아가시겠습니까?")) {
        // 확인 버튼을 누른 경우: 특정 경로로 이동
        router.push('/mywadiz/supporter');
      }
      // 취소 버튼을 누른 경우: 아무 동작도 하지 않음
    };

    // 유저 정보 업데이트 로직
    const updateUserInfo = async () => {
      try {
        await apiWrapper.postData("/api/input/userinfo", {
          userName: userInfo.userName,
          userContent: userInfo.userContent,
          userNick: userInfo.userNick
        });
        alert("유저 정보가 저장되었습니다.");
        // router.push("/mywadiz/supporter"); // 경로 이동
        window.location.href = "http://localhost:3000/mywadiz/supporter";
      } catch (error) {
        console.error(error);
        alert("유저 정보를 저장하는 중 오류가 발생했습니다.");
      }
    };

    // 비밀번호 검증 로직
    const isPasswordValid = ref(false); // 저장 버튼 활성화 여부
    const verifyPassowrd = async () => {
      try {
        const response = await apiWrapper.postData("/api/auth/password", {
          password: userInfo.password
        });
        if (response.data) {
          alert("비밀번호가 맞습니다.");
          isPasswordValid.value = true; // 버튼 활성화
        } else {
          alert("비밀번호가 틀렸습니다.");
          isPasswordValid.value = false; // 버튼 비활성화
        }
      } catch (error) {
        console.error(error);
        alert("비밀번호 확인 중 오류가 발생했습니다.");
        isPasswordValid.value = false;
      }
    };

    const sendEmail = async () => {
      try {
        state.isLoading = true; // 로딩 상태 활성화

        const response = await apiWrapper.getData(`api/auth/useremail`);
        console.log("Response.data:", response.key);

        // 성공적으로 이메일이 발송된 경우
        if (response.key) {
          state.key = response.key; // 인증 키 저장
          alert("인증 키가 이메일로 발송되었습니다.");
        }
      } catch (error) {
        // 서버에서 오류 응답을 반환한 경우
        if (error.response && error.response.status === 409) {
          alert("이미 존재하는 이메일입니다.");
        } else {
          // 기타 오류 처리
          console.error("이메일 발송 중 오류:", error);
          alert("이메일 발송에 실패했습니다.");
        }
      } finally {
        state.isLoading = false; // 로딩 상태 비활성화
      }
    };

    // 이메일 인증 확인 로직
    const verifyKey = () => {
      if (state.key === state.verificationKey) {
        state.isVerified = true; // 인증 성공 시 상태 변경
        alert("인증 성공!");
      } else {
        alert("인증 키가 일치하지 않습니다.");
      }
    };

    // 프로필 이미지 초기화
    const fetchInitialProfileImage = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/profileimage`);

        if (response.status === 204) {
          console.warn("초기 프로필 이미지가 없습니다.");
          return;
        }

        const fileData = response; // 서버 응답이 바로 FileDTO 객체라고 가정
        console.log(response);
        profileImage.value = fileData.signedUrl; // 썸네일 URL 설정
        fileId.value = fileData.fileId; // fileId 저장
      } catch (error) {
        console.error("프로필 가져오기 실패:", error);
      }
    };

    // 프로필 정보 초기화
    const fetchInitialUserInfo = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/user/isms`);
        const data = response;
        console.log(data);

        // reactive 상태 업데이트
        userInfo.email = data.email;
        userInfo.userNick = data.userNick;
        userInfo.userName = data.userName;
        userInfo.provider = data.provider;
        userInfo.userContent = data.userContent;
      } catch (error) {
        console.error("사용자 정보 가져오기 실패", error);
      }
    }

    // 파일 업로드 처리
    const onImageUpload = async (event) => {
      const file = event.target.files[0];

      // 중복 실행 방지
      if (!file) {
        console.warn("파일이 선택되지 않았습니다.");
        return;
      }

      if (!file || file.size > 10 * 1024 * 1024) {
        alert("이미지는 10MB 이하의 JPG, JPEG, PNG 파일만 업로드할 수 있습니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        // 기존 파일이 존재하면 삭제
        if (fileId.value) {
          console.log("기존 이미지를 삭제 중...");
          await removeImage();
        }

        const response = await apiWrapper.postFileData(`/api/upload/profileimage`, formData);
        console.log(response);
        const fileData = response.data; // 서버에서 반환된 데이터가 단순 문자열로 전달됨
        console.log("Signed URL:", fileData);

        fileId.value = null; // fileId는 필요 없을 수 있으므로 유지할지 확인
        profileImage.value = fileData; // signedUrl로 설정
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드 중 문제가 발생했습니다.");
      }
    };

    const removeImage = async () => {
      if (!fileId.value) {
        alert("삭제할 이미지가 없습니다.");
        return;
      }

      try {
        await apiWrapper.getData(`/api/${fileId.value}/delete/profileimage`);
        alert("이미지가 변경되었습니다.");
        profileImage.value = null; // 화면에서 썸네일 제거
        fileId.value = null; // fileId 초기화
        if (fileInput.value) {
          fileInput.value.value = ""; // 파일 입력 초기화
        }
      } catch (error) {
        console.error("이미지 삭제 실패:", error);
        alert("이미지 삭제 중 문제가 발생했습니다.");
      }
    };

    // 이름 플래그
    const initializeInput = () => {
      if (userInfo.userName) {

        isNameDisabled.value = true; // 이름이 있으면 비활성화
        console.log("플래그 값" + isNameDisabled.value);
      }
    };

    onMounted(async () => {
      await fetchInitialUserInfo(); // 유저 정보 가져오기 완료 후
      initializeInput(); // 이름 값 확인 및 플래그 설정
      fetchInitialProfileImage(); // 프로필 이미지는 병렬로 처리
    });

    return {
      onImageUpload,
      removeImage,
      profileImage,
      fileId,
      userInfo,
      state,
      supportPage,
      isPasswordValid,
      verifyPassowrd,
      updateUserInfo,
      sendEmail,
      verifyKey,
      isNameDisabled
    }
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

.custom-file-upload {
  display: inline-block;
  padding: 6px 12px;
  cursor: pointer;
  border: 1px solid #007bff;
  border-radius: 4px;
  color: #007bff;
  background-color: #fff;
  text-align: center;
}

.custom-file-upload:hover {
  background-color: #0d6efd;
}
</style>
