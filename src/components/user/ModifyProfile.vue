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
      <label for="file-upload" class="custom-file-upload btn btn-outline-primary btn-sm mt-3" >
        사진 바꾸기
      </label>
      <input id="file-upload" type="file" style="display: none;" @change="onImageUpload">
    </div>

    <!-- 기본 정보 설정 -->
    <div class="text-start">
      <h5 class="fw-bold">기본 정보 설정</h5>
      <p class="text-muted small">이름은 한 번 입력하면 바꿀 수 없어요.</p>
    </div>

    <!-- 이름 출력 -->
    <div class="form-group mt-3">
      <input type="text" class="form-control custom-input" placeholder="이름을 입력하세요"  />
    </div>

    <!-- 닉네임 입력 -->
    <div class="form-group mt-3">
      <input type="text" class="form-control custom-input" placeholder="닉네임" disabled/>
    </div>

    <!-- 이메일 변경 -->
    <div class="input-group mt-3">
      <input type="email" class="form-control custom-input" placeholder="이메일" disabled />
    </div>

    <!-- 전화번호 변경 -->
    <div class="input-group mt-3">
      <input type="text" class="form-control custom-input" placeholder="전화번호" disabled />
    </div>

    <!-- SNS 연동 -->
    <div class="text-start">
      <h5 class="fw-bold mt-4">SNS 연동</h5>
      <p class="text-muted small">Naver, Google 연동을 확인할 수 있어요.</p>
    </div>

    <!-- SNS 버튼 (배지 크기 증가) -->
    <div class="d-flex mb-4">
      <span class="badge bg-success me-2 custom-badge">Naver</span>
      <span class="badge bg-light text-dark border custom-badge">Google</span>
    </div>

    <!-- 취소 및 확인 버튼 -->
    <div class="d-flex justify-content-between mb-5">
      <button class="btn btn-secondary w-48">취소</button>
      <button class="btn btn-primary w-48">저장</button>
    </div>
  </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import apiWrapper from "../../util/axios/axios.js";

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
      id: null,
      email: '',
      userNick: '',
      provider: ''
    });

    const fetchInitialProfileImage = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/profileimage`);

        if (response.status === 204 ) {
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

    const fetchInitialUserInfo = async () => {
      try {
        const response = await apiWrapper.getData(`/api/get/user`);
        const data = response;
        console.log(data);

        // reactive 상태 업데이트
        userInfo.id = data.id;
        userInfo.email = data.email;
        userInfo.userNick = data.userNick;
        userInfo.provider = data.provider;
      } catch (error) {
        console.error("사용자 정보 가져오기 실패", error);
      }
    }

    const myMaker = async () => {
      router.push('/mywadiz/maker');
    };

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

    onMounted(() => {
      fetchInitialProfileImage(); // 컴포넌트 초기화 시 썸네일 데이터 가져오기
    });

    return {
      onImageUpload,
      removeImage,
      profileImage,
      fileId,
      userInfo
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
