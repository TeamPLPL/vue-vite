<template>
    <div class="container mt-5 text-center">
        <!-- Profile Picture and Basic Info -->
        <div class="d-flex flex-column align-items-center mb-4">
            <img src="https://via.placeholder.com/100" alt="Profile Picture" class="rounded-circle mb-2"
                style="background-color: #e0d7f3;" />
            <h4>닉네임</h4>
            <p class="mb-1">이름</p>
            <p class="text-muted">abcd1234@gmail.com</p>
        </div>

        <!-- Buttons Section -->
        <div class="d-flex justify-content-center mb-4">
            <button class="btn btn-outline-secondary mx-2">비밀번호</button>
            <input type="text" class="form-control d-inline mx-2" placeholder="내 비밀번호" style="width: 80px;" />
            <button class="btn btn-warning mx-2">변경</button>
            <input type="text" class="form-control d-inline mx-2" placeholder="Days" style="width: 80px;" />
            <button class="btn btn-warning mx-2">회원 정지</button>
            <button class="btn btn-warning mx-2">정지 취소</button>
        </div>

        <!-- User Information Table -->
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

        <!-- Back Button -->
        <button class="btn btn-secondary mt-4">돌아가기</button>
    </div>
</template>

<script>
export default {
    name: "UserProfile",
};
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.btn-warning {
    background-color: #f0ad4e;
    color: white;
}

.btn-secondary {
    background-color: #7b5bb7;
    color: white;
}
</style>