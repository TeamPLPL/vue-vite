<template>
    <div class="container mt-5">
        <table class="table table-bordered text-center">
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
                <tr v-for="member in members" :key="member.id">
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
        <div class="pagination">
            <button v-for="page in pages" :key="page" class="page-link">{{ page }}</button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const members = ref([
    {
        id: 1,
        email: "a@gmail.com",
        nickname: "강복순",
        name: "강복돌",
        socialLogin: "페이스북",
        joinDate: "2021.09.28",
        isDeleted: false,
    },
    {
        id: 2,
        email: "b@gmail.com",
        nickname: "권럭키",
        name: "권인석",
        socialLogin: "",
        joinDate: "2019.09.09",
        isDeleted: true,
    },
    {
        id: 3,
        email: "c@gmail.com",
        nickname: "미네랄",
        name: "김민혜",
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
    {
        id: 5,
    },
    {
        id: 6,
    },
    {
        id: 7,
    },
    {
        id: 8,
    },
    {
        id: 9,
    },
    {
        id: 10,
    },
]);

const pages = ref([1, 2, 3, 4, 5]); // 페이지 네이션

function goToMemberDetail(id) {
    router.push({ name: "MemberDetail", params: { id } });
}
</script>

<style scoped>
.table {
    vertical-align: middle
}

.table th,
.table td {
    background-color: #00ff48 !important;
    vertical-align: middle;
}

.table th {
    font-weight: bold;
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

.pagination {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.page-link {
    margin: 0 5px;
    padding: 5px 10px;
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}

.page-link:hover {
    background-color: #ddd;
}
</style>