<template>
    <div class="container mt-5">
        <table class="table table-bordered text-center" style="background-color: #e0f8d8;">
            <thead>
                <tr>
                    <th>프로젝트명</th>
                    <th>시작일</th>
                    <th>종료일</th>
                    <th>승인여부</th>
                    <th>승인</th>
                    <th>반려</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="project in projects" :key="project.id">
                    <td>{{ project.name }}</td>
                    <td>{{ project.startDate || "NULL" }}</td>
                    <td>{{ project.endDate }}</td>
                    <td>{{ project.isApproved ? "true" : "false" }}</td>
                    <td>
                        <button class="btn btn-success">승인</button>
                    </td>
                    <td>
                        <button class="btn btn-warning">반려</button>
                    </td>
                    <td>
                        <button class="btn btn-danger">삭제</button>
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
import { ref } from 'vue';

const projects = ref([
    { id: 1, name: "아르피아 복원", startDate: null, endDate: "2026.01.24", isApproved: false },
    { id: 2, name: "비건 사료", startDate: "2023.07.03", endDate: "2024.03.28", isApproved: true },
    { id: 3, name: "무알콜 와인", startDate: null, endDate: "2025.11.18", isApproved: false },
    { id: 4, name: "다이어리 케이스", startDate: null, endDate: "2025.08.18", isApproved: false },
    { id: 5, },
    { id: 6, },
    { id: 7, },
    { id: 8, },
    { id: 9, },
    { id: 10, },
]);

const pages = ref([1, 2, 3, 4, 5]); // 페이지 네이션
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
    background-color: #00ff48 !important;
}

.btn-success {
    background-color: #4CAF50;
    color: white;
}

.btn-warning {
    background-color: #f0ad4e;
    color: white;
}

.btn-danger {
    background-color: #e74c3c;
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