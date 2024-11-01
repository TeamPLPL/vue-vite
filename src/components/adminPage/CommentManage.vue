<template>
    <div class="container mt-5">
        <table class="table table-bordered text-center">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>내용</th>
                    <th>카테고리</th>
                    <th>작성날짜</th>
                    <th>삭제하기</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.content }}</td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.date }}</td>
                    <td>
                        <button class="btn btn-link text-danger">삭제</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "ReviewTable",
    data() {
        return {
            items: [
                { id: 1, content: "모두 화이팅입니다", category: "응원", date: "2023.01.18" },
                { id: 2, content: "민트초코는 빼주세요", category: "의견", date: "2023.01.19" },
                { id: 3, content: "아아아아아메리카노", category: "리뷰", date: "2023.02.18" },
                { id: 4, content: "이집 맛있네요", category: "의견", date: "2023.02.18" },
                { id: 5, content: "이거 사기네요", category: "의견", date: "2023.03.16" },
                { id: 6, content: "불매합시다", category: "응원", date: "2023.04.28" },
                { id: 7, content: "멍멍멍멍멍", category: "응원", date: "2023.05.11" },
                { id: 8, content: "반려견은 욕이 아닙니다", category: "리뷰", date: "2023.05.13" },
                { id: 9, content: "비건사료 아닌데", category: "의견", date: "2024.01.05" },
                { id: 10, content: "이와인 상했네요", category: "리뷰", date: "2024.01.18" },
            ],
        };
    },
};
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.text-danger {
    color: red;
}
</style>