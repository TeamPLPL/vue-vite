<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePaymentStore } from './util/store/paymentStore';

const router = useRouter();
const route = useRoute();
const paymentStore = usePaymentStore();

// Detect if the current route requires a gray background
const isGrayBackground = computed(() => route.meta.grayBackground);

onMounted(() => {
    // Check if payment is successful and redirect if needed
    if (paymentStore.isPaymentSuccessful) {
        router.push('/purchase/step30/:id');
        paymentStore.resetPaymentStatus();
    }
});
</script>

<template>
    <RouterView />
</template>

<style>
</style>
