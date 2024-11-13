<template>
    <div v-show="show" class="modal-overlay">
        <div class="modal">
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="modal-buttons">
                <button @click="cancel" class="btn btn-secondary">다시 생각하기</button>
                <button @click="confirm" class="btn btn-primary">취소하기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean,
    title: String,
    message: String
});

const emit = defineEmits(['close', 'confirm']); // emit 정의

function cancel() {
    emit('close'); // close 이벤트 emit
}

function confirm() {
    emit('confirm'); // confirm 이벤트 emit
}

</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-height: 200px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1010;
    position: relative; /* 기본 위치 */
    display: block;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.btn-secondary {
    background-color: #f1f1f1;
    color: #333;
}

.btn-primary {
    background-color: #0c8;
    color: white;
}
</style>