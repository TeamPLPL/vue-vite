<template>
    <div id="address-container" class="container">
        <!-- 주소 정보 설정 -->
        <div class="text-start">
            <h4 class="fw-bold">배송지 정보 설정</h4>
            <br />
            <h5 class="fw-bold">우편번호 설정</h5>
        </div>

        <div class="row mb-4">
            <div class="col-auto zonecode pe-0 flex-grow-1">
                <input type="text" v-model="zonecode" class="form-control w-100" placeholder="우편번호" readonly>
            </div>
            <div class="col-auto zonecode ps-2">
                <button @click="execDaumPostcode" class="btn btn-light">우편번호 찾기</button>
            </div>
        </div>

        <div class="row mb-2 align-items-center flex-wrap">
            

            <br />
            
            <div class="text-start">
                <h5 class="fw-bold">주소 입력</h5>
            </div>
            <div class="col-12 col-md d-flex justify-content-between align-items-center flex-wrap">
                <div class="col-auto d-flex align-items-center mb-2 mb-md-0">
                    <div class="form-check mb-0">
                        <input class="form-check-input" type="checkbox" v-model="isDefault" id="defaultAddressCheck">
                        <label class="form-check-label" for="defaultAddressCheck">
                            기본 배송지로 설정
                        </label>
                    </div>
                </div>
                <div class="col-auto">
                    <button @click="showAddressList" class="btn btn-secondary">기존 배송지</button>
                </div>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <input type="text" v-model="addr" class="form-control" placeholder="주소" readonly>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col">
                <input type="text" v-model="addrEng" class="form-control" placeholder="영문 주소" readonly>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-2">
                <input type="text" v-model="detailAddr" class="form-control" placeholder="상세주소">
            </div>
            <div class="col-md-6 mb-2">
                <input type="text" v-model="extraAddr" class="form-control" placeholder="참고항목" readonly>
            </div>
        </div>

        <!-- 취소 및 주소 저장 버튼 -->
        <div class="d-flex justify-content-between button-width">
            <button v-if="showCancelButton" class="btn btn-secondary w-100 me-2">취소</button>
            <button @click="saveAddr" class="btn btn-primary w-100" style="background-color: #00c4c4;">주소 저장</button>
        </div>
    </div>

    <!-- 모달 부분 수정 -->
    <div class="modal fade" id="addressListModal" tabindex="-1" aria-labelledby="addressListModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addressListModalLabel">기존 배송지 목록</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-group">
                        <li v-for="address in addressList" :key="address.id" class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center w-100">
                                <div class="address-info">
                                    <strong>{{ address.addr }}</strong><br>
                                    {{ address.detailAddr }} ({{ address.zonecode }})
                                </div>
                                <div class="button-group">
                                    <button @click="deleteAddress(address)"
                                        class="btn btn-warning btn-sm me-2">삭제</button>
                                    <button @click="selectAddress(address)" class="btn btn-primary btn-sm">선택</button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // useRoute 가져오기
import apiWrapper from '../../util/axios/axios';
import { Modal } from 'bootstrap'

const route = useRoute(); // 현재 경로 정보를 가져옴

// emit 정의
const emit = defineEmits(['selectedAddress']); // 이벤트 이름 지정

const zonecode = ref('');
const addr = ref('');
const addrEng = ref('');
const detailAddr = ref('');
const extraAddr = ref('');
const isDefault = ref(false);

const addressList = ref([]);
let addressListModal;

// 현재 라우트가 /mywadiz/info/deliveryAddress 인지 확인하여 취소 버튼 표시 여부 결정
const showCancelButton = ref(route.path === '/mywadiz/info/deliveryAddress');

const execDaumPostcode = () => {
    new window.daum.Postcode({
        oncomplete: (data) => {
            zonecode.value = data.zonecode;
            addr.value = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
            addrEng.value = data.userSelectedType === 'R' ? data.roadAddressEnglish : data.jibunAddressEnglish; // 영문 주소 설정

            if (data.userSelectedType === 'R') {
                let extraAddress = '';

                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddress !== '') {
                    extraAddress = ` (${extraAddress})`;
                }
                extraAddr.value = extraAddress;
            } else {
                extraAddr.value = '';
            }

            detailAddr.value = '';
        }
    }).open();
};

onMounted(() => {
    getAddrApiScript();
    setDefaultAddr();
    if (typeof Modal !== 'undefined') {
        addressListModal = new Modal(document.getElementById('addressListModal'));
    } else {
        console.error('Bootstrap Modal is not defined');
    }
});

const getAddrApiScript = () => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
}

// 기본 주소 조회 함수
const setDefaultAddr = async () => {
    try {
        const data = await apiWrapper.getDefaultAddr()
        console.log(data)
        if (data == null) return;
        zonecode.value = data.zonecode
        addr.value = data.addr
        addrEng.value = data.addrEng
        detailAddr.value = data.detailAddr
        extraAddr.value = data.extraAddr
        isDefault.value = data.isDefault || false
    } catch (error) {
        console.error('주소 저장 중 오류 발생:', error);
    }
}

const saveAddr = async () => {
    try {
        const addressData = {
            zonecode: zonecode.value,
            addr: addr.value,
            addrEng: addrEng.value,
            detailAddr: detailAddr.value,
            extraAddr: extraAddr.value,
            isDefault: isDefault.value
        };
        console.log('Sending data:', addressData);
        await apiWrapper.saveAddress(addressData);
        alert('주소가 성공적으로 저장되었습니다.');
    } catch (error) {
        console.error('주소 저장 중 오류 발생:', error);
        alert('주소 저장에 실패했습니다.');
    }
};


const showAddressList = async () => {
    try {
        // 서버에서 배송지 리스트 가져오기
        const data = await apiWrapper.getAddressList();
        addressList.value = data;
        // 모달 열기
        addressListModal.show();
    } catch (error) {
        console.error('배송지 목록 조회 중 오류 발생:', error);
        alert('배송지 목록을 불러오는데 실패했습니다.');
    }
};

const selectAddress = (selectedAddress) => {
    // 선택한 주소로 폼 업데이트
    zonecode.value = selectedAddress.zonecode;
    addr.value = selectedAddress.addr;
    addrEng.value = selectedAddress.addrEng;
    detailAddr.value = selectedAddress.detailAddr;
    extraAddr.value = selectedAddress.extraAddr;
    isDefault.value = selectedAddress.isDefault;

    // emit을 통해 부모 컴포넌트로 선택된 주소 전달
    emit('selectedAddress', selectedAddress);
    console.log('선택된 주소 emit:', selectedAddress);

    // 모달 닫기
    addressListModal.hide();
};

const deleteAddress = async (address) => {
    if (confirm('이 주소를 삭제하시겠습니까?')) {
        try {
            await apiWrapper.deleteAddress(address.id);
            addressList.value = addressList.value.filter(a => a.id !== address.id);
            alert('주소가 성공적으로 삭제되었습니다.');
        } catch (error) {
            console.error('주소 삭제 중 오류 발생:', error);
            alert('주소 삭제에 실패했습니다.');
        }
    }
};
</script>

<style scoped>
#address-container {
    max-width: 500px;
    margin: auto;
}

.button-width {
    width: 100%;
}

.zonecode {
    padding-right: 0 !important;
}

@media (max-width: 767px) {
    .zonecode {
        width: auto;
    }
}

.modal-body .list-group-item {
    padding: 0.75rem 1.25rem;
}

.modal-body .list-group-item>div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.modal-body .address-info {
    flex-grow: 1;
    text-align: left;
    padding-right: 1rem;
}

.modal-body .button-group {
    flex-shrink: 0;
    white-space: nowrap;
}

.modal-body .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}
</style>