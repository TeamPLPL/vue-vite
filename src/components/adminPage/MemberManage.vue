<template>
    <div class="container mt-5">
        <table class="table table-bordered text-center" style="background-color: #e0f8d8;">
            <thead>
                <tr>
                    <th>이메일</th>
                    <th>닉네임</th>
                    <th>이름</th>
                    <th>소셜로그인</th>
                    <th>가입일</th>
                    <th>수정</th>
                    <th>탈퇴여부</th>
                    <th>탈퇴</th>
                    <th>복원</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="member in members" :key="member.email">
                    <td>{{ member.email }}</td>
                    <td>{{ member.nickname }}</td>
                    <td>{{ member.name }}</td>
                    <td>{{ member.socialLogin }}</td>
                    <td>{{ member.joinDate }}</td>
                    <td>
                        <button class="btn btn-success" @click="goToMemberDetail(member.id)">수정</button>
                    </td>
                    <td>{{ member.isDeleted ? 'true' : 'false' }}</td>
                    <td>
                        <button class="btn btn-danger" :disabled="member.isDeleted">탈퇴</button>
                    </td>
                    <td>
                        <button class="btn btn-warning" :disabled="!member.isDeleted">복원</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "MemberManage",
    data() {
        return {
            members: [
                {
                    id: 1,
                    email: "a@gmail.com",
                    nickname: "강북순",
                    name: "강북도",
                    socialLogin: "페이스북",
                    joinDate: "2021.09.28",
                    isDeleted: false,
                },
                {
                    id: 2,
                    email: "b@gmail.com",
                    nickname: "권혁기",
                    name: "권인석",
                    socialLogin: "",
                    joinDate: "2019.09.09",
                    isDeleted: true,
                },
                {
                    id: 3,
                    email: "c@gmail.com",
                    nickname: "미래합",
                    name: "김인애",
                    socialLogin: "인스타그램",
                    joinDate: "2014.03.28",
                    isDeleted: false,
                },
                {
                    id: 4,
                    email: "d@gmail.com",
                    nickname: "아라니",
                    name: "임지연",
                    socialLogin: "페이스북",
                    joinDate: "2024.10.28",
                    isDeleted: false,
                },
            ],
        };
    },
    methods: {
        goToMemberDetail(id) {
            this.$router.push({ name: "MemberDetail", params: { id } });
        },
    },
};
</script>

<style scoped>
.table {
    background-color: #e0f8d8;
}

.table th,
.table td {
    vertical-align: middle;
}

.btn-success {
    background-color: #4CAF50;
    color: white;
}

.btn-danger {
    background-color: #e74c3c;
    color: white;
}

.btn-warning {
    background-color: #f0ad4e;
    color: white;
}
</style>