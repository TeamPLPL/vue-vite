<template>
    <div class="row">
        
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const fundingId = ref(null);

onMounted(() => {
    fundingId.value = route.params.id;
    // fundingId를 사용하여 필요한 데이터를 가져오거나 처리하는 로직을 여기에 추가
    console.log('Funding ID:', fundingId.value);
});
</script>


<style scoped>

</style>