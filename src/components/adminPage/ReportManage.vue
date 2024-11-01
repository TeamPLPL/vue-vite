<template>
    <div class="container mt-5">
        <!-- Title and Filter Options -->
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>신고게시판 <span class="text-success">{{ reports.length }}</span></h4>
            <div>
                <select class="form-select d-inline-block me-2" style="width: auto;">
                    <option>전체</option>
                    <option>사용자</option>
                    <option>댓글</option>
                    <option>컨텐츠</option>
                </select>
                <select class="form-select d-inline-block" style="width: auto;">
                    <option>최신순</option>
                    <option>오래된순</option>
                </select>
            </div>
        </div>

        <!-- Report Table -->
        <table class="table table-hover text-center">
            <thead>
                <tr>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>신고일자</th>
                    <th>신고자</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="report in reports" :key="report.id">
                    <td><a href="#" class="text-decoration-none text-dark">{{ report.title }}</a></td>
                    <td>{{ report.category }}</td>
                    <td>{{ report.date }} {{ report.time }}</td>
                    <td>{{ report.reporter }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: "ReportBoard",
    data() {
        return {
            reports: [
                {
                    id: 1,
                    title: "[펀딩] 밤버터 시리즈 05, 이번엔 버터밤",
                    category: "사용자",
                    date: "2024-10-25",
                    time: "13:27",
                    reporter: "12nickname12",
                },
                {
                    id: 2,
                    title: "[펀딩] 밤버터 시리즈 05, 이번엔 버터밤",
                    category: "댓글",
                    date: "2024-10-25",
                    time: "13:27",
                    reporter: "12nickname12",
                },
                {
                    id: 3,
                    title: "[펀딩] 밤버터 시리즈 05, 이번엔 버터밤",
                    category: "펀딩",
                    date: "2024-10-25",
                    time: "13:27",
                    reporter: "12nickname12",
                },
                // 필요한 만큼의 데이터 추가
            ],
        };
    },
};
</script>

<style scoped>
.table {
    font-size: 0.9rem;
}

.table th,
.table td {
    vertical-align: middle;
}

h4 {
    font-weight: bold;
}

.text-success {
    font-weight: bold;
}

.form-select {
    font-size: 0.9rem;
}

.text-decoration-none {
    color: inherit;
}

.text-dark:hover {
    color: #0056b3;
}
</style>