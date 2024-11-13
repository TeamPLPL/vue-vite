<template>
  <!-- Content -->
  <!-- 메이커 유형 -->
  <div class="mt-5">
    <h4 class="fw-bold text-start">메이커 유형 <span class="text-danger">*</span></h4>
    <div class="d-flex justify-content-start mb-3" style="width: 33%;">
      <div class="btn-group w-100" role="group">
        <button
            class="btn w-50"
            :class="{ 'btn-outline-primary': state.makerType !== 'individual', 'btn-primary': state.makerType === 'individual' }"
            @click="setMakerType('individual')"
        >
          개인
        </button>
        <button
            class="btn w-50"
            :class="{ 'btn-outline-primary': state.makerType !== 'business', 'btn-primary': state.makerType === 'business' }"
            @click="setMakerType('business')"
        >
          사업자
        </button>
      </div>
    </div>


    <!-- 개인 유형 내용 -->
    <div v-if="state.makerType === 'individual'">
      <ul class="list-unstyled">
        <li class="d-flex align-items-center mb-3">
          <label for="representative-name" class="me-3 w-25 text-start">대표자명</label>
          <input type="text" id="representative-name" class="form-control float-start" style="width: 50%;"
                 placeholder="대표자명"/>
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="representative-email" class="me-3 w-25 text-start">대표자 이메일</label>
          <input type="email" id="representative-email" class="form-control float-start" style="width: 50%;"
                 placeholder="이메일"/>
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="ssn" class="me-4 w-25 text-start">주민번호 앞 7자리</label>
          <div class="d-flex w-75">
            <input
                type="text"
                id="ssn"
                class="form-control"
                style="width: 120px; font-size: 0.875rem;"
                placeholder="번호 앞 6자리"
                maxlength="6"
                v-model="state.ssnFront"
                @input="moveFocusToNext"
            />
            <span class="mx-2">-</span>
            <input type="text" class="form-control me-2" maxlength="1" style="width: 35px; font-size: 0.875rem;" placeholder="*"
                   v-model="state.ssnBack"/>
            <input type="text" class="form-control text-center" style="width: 100px;" disabled value="* * * * * *"/>
          </div>
        </li>
      </ul>
    </div>

    <!-- 사업자 유형 내용 -->
    <div v-if="state.makerType === 'business'">
      <div class="alert bg-light text-start">
        <i class="bi bi-info-circle-fill"></i> 사업자등록증의 상단의 사업자 종류에 맞게 메이커 유형을 선택해 주세요.<br/>
        국세청에 등록된 사업자 정보를 기준으로 인증을 진행하고 있어요. 사업자등록증의 정보가 국세청에 등록된 정보와 다르다면, 국세청에서 등록된 사업자정보로 수정 후 인증해 주세요.
      </div>
      <ul class="list-unstyled">
        <li class="d-flex align-items-center mb-3">
          <label for="representative-name" class="me-3 w-25 text-start">대표자명</label>
          <input type="text" id="representative-name" class="form-control float-start" style="width: 50%;"
                 placeholder="대표자명"/>
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="representative-email" class="me-3 w-25 text-start">대표자 이메일</label>
          <input type="email" id="representative-email" class="form-control float-start" style="width: 50%;"
                 placeholder="이메일"/>
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="business-license" class="me-3 w-25 text-start">사업자 등록증</label>
          <input type="file" id="business-license" class="form-control float-start" style="width: 50%;"/>
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="business-number" class="me-3 w-25 text-start">사업자 등록 번호</label>
          <input type="text" id="business-number" class="form-control float-start" style="width: 50%;"
                 placeholder="사업자 등록 번호 (10자리)" maxlength="10"/>
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="company-name" class="me-3 w-25 text-start">상호(법인명)</label>
          <input type="text" id="company-name" class="form-control float-start" style="width: 50%;"
                 placeholder="상호(법인명)"/>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive} from "vue";

export default defineComponent({
  setup() {
    const state = reactive({
      makerType: "individual", // 초기값을 개인으로 설정
      ssnFront: "",
      ssnBack: ""
    });

    const setMakerType = (type) => {
      state.makerType = type;
    };

    const moveFocusToNext = () => {
      if (state.ssnFront.length === 6) {
        // 주민등록번호 앞 6자리가 입력되면 다음 필드로 포커스를 이동
        document.querySelector("input[placeholder='*']").focus();
      }
    };

    return {
      state,
      setMakerType,
      moveFocusToNext,
    };
  },
});
</script>

<style scoped>

</style>
