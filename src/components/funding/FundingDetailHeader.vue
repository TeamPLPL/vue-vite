<template>
    <nav class="navbar sticky-top navbar-light bg-light">
        <div id="detailHeaderNav" class="container-sm d-flex justify-content-center">
            <ul class="nav nav-underline">
                <li class="nav-item nav-link">
                    <router-link :to="`/funding/${route.params.id}/detail`">펀딩정보</router-link>
                </li>
                <li class="nav-item nav-link">
                    <router-link :to="`/funding/${route.params.id}/notice`">공지사항</router-link>
                </li>
                <li class="nav-item nav-link">
                    <router-link :to="`/funding/${route.params.id}/board`">후원자게시판</router-link>
                </li>
                <li class="nav-item nav-link">
                    <router-link :to="`/funding/${route.params.id}/info`">리워드·환불</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute(); // 현재 경로 정보를 가져오기 위해 useRoute 사용
</script>

<style scoped>
/* sticky-top이 적용되지 않는다면 아래의 스타일을 추가하여 문제를 해결할 수 있습니다. */
a {
    /* color: #333; */
    text-decoration: none;
}
</style>
