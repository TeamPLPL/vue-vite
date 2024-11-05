<template>
    <div class="container mt-5 text-center">
        <!-- 프로필 사진과 기본 정보 -->
        <div class="profile-container d-flex align-items-center">
            <!-- 프로필 사진 -->
            <img src="https://via.placeholder.com/100" alt="Profile Picture" class="profile-picture rounded-circle" />

            <!-- 닉네임, 이름, 이메일 -->
            <div class="profile-info ms-3">
                <h3 class="nickname mb-1 text-start">닉네임</h3>
                <p class="name mb-1 text-start">이름</p>
                <p class="email text-muted text-start">abcd1234@gmail.com</p>
            </div>
        </div>

        <!-- 버튼 섹션 -->
        <div class="d-flex justify-content-center align-items-center mb-4 button-section">
            <button class="btn btn-outline-secondary mx-1">비밀번호</button>
            <input type="text" class="form-control d-inline mx-1 password-input" placeholder="내 비밀번호" />
            <button class="btn btn-warning mx-1">변경</button>
            <input type="text" class="form-control d-inline mx-1 days-input" placeholder="Days" />
            <button class="btn btn-warning mx-1">회원 정지</button>
            <button class="btn btn-warning mx-1">정지 취소</button>
        </div>

        <!-- 사용자 정보 테이블 -->
        <table class="table table-bordered text-center">
            <thead>
                <tr>
                    <th>가입일</th>
                    <th>신고횟수</th>
                    <th>탈퇴여부</th>
                    <th>소셜로그인</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2019.03.29</td>
                    <td>0</td>
                    <td>false</td>
                    <td>Facebook</td>
                </tr>
            </tbody>
        </table>

        <!-- 돌아가기 버튼 -->
        <button class="btn btn-secondary mt-4" @click="goBack">돌아가기</button>
    </div>
</template>

<script setup>
function goBack() {
    window.history.back();
}
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

/* 프로필 섹션 */
.rounded-circle {
    width: 100px;
    height: 100px;
}

/* 버튼과 입력 필드 스타일 */
.button-section .btn-warning {
    background-color: #f0ad4e;
    color: white;
    border: none;
}

.btn-secondary {
    background-color: #7b5bb7;
    color: white;
    border: none;
}

.password-input {
    width: 120px;
    margin-right: 5px;
}

.days-input {
    width: 80px;
    margin-left: 5px;
}

.button-section .btn,
.button-section .form-control {
    height: 38px;
    padding: 0 10px;
}

/* 버튼과 입력 필드 간격 조정 */
.button-section .btn,
.button-section .form-control {
    margin: 0 4px;
}

/* 프로필 컨테이너 */
.profile-container {
    padding: 1rem;
}

/* 프로필 사진 */
.profile-picture {
    width: 150px;
    height: 150px;
    background-color: #e0d7f3;
}

/* 프로필 정보 */
.profile-info .nickname {
    font-weight: bold;
    font-size: 1.2rem;
}

.profile-info .name {
    font-size: 1rem;
    color: black;
}

.profile-info .email {
    font-size: 0.9rem;
    color: black;
}
</style>