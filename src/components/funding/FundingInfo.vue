<template>
    <div class="funding-info container mt-4">
        <div class="row">
            <div class="col-12">
                <div class="refund-policy mb-5">
                    <h3 class="section-title">환불 정책</h3>
                    <div class="policy-content" v-if="refundPolicy">
                        <p v-for="(line, index) in refundPolicyLines" :key="index">{{ line }}</p>
                    </div>
                </div>

                <div class="reward-info" v-if="rewardInfo">
                    <h3 class="section-title">리워드 정보 제공 고시</h3>
                    <div class="info-table">
                        <table>
                            <tr v-if="rewardInfo.modelName">
                                <th>모델명</th>
                                <td>{{ rewardInfo.modelName }}</td>
                            </tr>
                            <tr v-if="rewardInfo.productMaterial">
                                <th>제품 소재</th>
                                <td>{{ rewardInfo.productMaterial }}</td>
                            </tr>
                            <tr v-if="rewardInfo.color">
                                <th>색상</th>
                                <td>{{ rewardInfo.color }}</td>
                            </tr>
                            <tr v-if="rewardInfo.field">
                                <th>분야</th>
                                <td>{{ rewardInfo.field }}</td>
                            </tr>
                            <tr v-if="rewardInfo.manufacturer">
                                <th>제조사</th>
                                <td>{{ rewardInfo.manufacturer }}</td>
                            </tr>
                            <tr v-if="rewardInfo.manufacturingCountry">
                                <th>제조국</th>
                                <td>{{ rewardInfo.manufacturingCountry }}</td>
                            </tr>
                            <tr v-if="rewardInfo.manufactureDate">
                                <th>제조일자</th>
                                <td>{{ rewardInfo.manufactureDate }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiWrapper from '../../util/axios/axios';

const route = useRoute();
const fundingId = inject('fundingId');
const fundingStartDate = inject('fundingStartDate')
const fundingEndDate = inject('fundingEndDate')

const rewardInfo = ref(null);
const refundPolicy = ref('');

const refundPolicyLines = computed(() => {
    return refundPolicy.value.split('\n');
});

onMounted(async () => {
    try {
        const data = await apiWrapper.fetchFundingInfo(fundingId.value);
        rewardInfo.value = data;
        refundPolicy.value = data.refundsPolicies;
    } catch (error) {
        console.error('Failed to fetch funding info:', error);
    }
});
</script>

<style scoped>
.funding-info {
    font-family: 'Noto Sans KR', sans-serif;
    color: #44484b;
}

.section-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #44484b;
}

.refund-policy,
.reward-info {
    margin-bottom: 40px;
    white-space: pre-line;
    text-align: left;
}

.policy-content {
    font-size: 14px;
    line-height: 1.6;
    text-align: left; 
}

.policy-content ul {
    padding-left: 20px;
    margin-bottom: 15px;
}

.policy-content li {
    margin-bottom: 10px;
}

.info-table {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
}

.info-table table {
    width: 100%;
    border-collapse: collapse;
}

.info-table th,
.info-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e5e5;
    text-align: left;
    font-size: 14px;
}

.info-table th {
    background-color: #f9fafb;
    font-weight: bold;
    width: 30%;
}

.info-table tr:last-child th,
.info-table tr:last-child td {
    border-bottom: none;
}
</style>