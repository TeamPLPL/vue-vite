<template>
  <!-- Content -->
  <!-- 메이커 유형 -->
  <div class="mt-5">
    <h4 class="fw-bold text-start">메이커 유형 <span class="text-danger">*</span></h4>
    <div class="d-flex justify-content-start mb-3" style="width: 33%;">
      <div class="btn-group w-100" role="group">
        <button
            class="btn w-50"
            :class="{ 'btn-outline-primary': state.makerType !== 'personal', 'btn-primary': state.makerType === 'personal' }"
            @click="setMakerType('personal')"
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
    <div v-if="state.makerType === 'personal'">
      <ul class="list-unstyled">
        <li class="d-flex align-items-center mb-3">
          <label for="representative-name" class="me-3 w-25 text-start">대표자명</label>
          <input
              type="text"
              id="representative-name"
              class="form-control float-start"
              style="width: 50%;"
              placeholder="대표자명"
              v-model="state.representativeName"
          />
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="representative-email" class="me-3 w-25 text-start">대표자 이메일</label>
          <input
              type="email"
              id="representative-email"
              class="form-control float-start"
              style="width: 50%;"
              placeholder="이메일"
              v-model="state.representativeEmail"
          />
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
            <input
                type="text"
                class="form-control me-2"
                maxlength="1"
                style="width: 35px; font-size: 0.875rem;"
                placeholder="*"
                v-model="state.ssnBack"
            />
            <input
                type="text"
                class="form-control text-center"
                style="width: 100px;"
                disabled
                value="* * * * * *"
            />
          </div>
        </li>
      </ul>
    </div>

    <!-- 사업자 유형 내용 -->
    <div v-if="state.makerType === 'business'">
      <ul class="list-unstyled">
        <li class="d-flex align-items-center mb-3">
          <label for="representative-name" class="me-3 w-25 text-start">대표자명</label>
          <input
              type="text"
              id="representative-name"
              class="form-control float-start"
              style="width: 50%;"
              placeholder="대표자명"
              v-model="state.representativeName"
          />
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="representative-email" class="me-3 w-25 text-start">대표자 이메일</label>
          <input
              type="email"
              id="representative-email"
              class="form-control float-start"
              style="width: 50%;"
              placeholder="이메일"
              v-model="state.representativeEmail"
          />
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="business-number" class="me-3 w-25 text-start">사업자 등록 번호</label>
          <input
              type="text"
              id="business-number"
              class="form-control float-start"
              style="width: 50%;"
              placeholder="사업자 등록 번호 (10자리)"
              maxlength="10"
              v-model="state.businessNumber"
          />
        </li>
        <li class="d-flex align-items-center mb-3">
          <label for="company-name" class="me-3 w-25 text-start">상호(법인명)</label>
          <input
              type="text"
              id="company-name"
              class="form-control float-start"
              style="width: 50%;"
              placeholder="상호(법인명)"
              v-model="state.companyName"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive, watch, onMounted } from "vue";
import apiWrapper from "../../../util/axios/axios.js";
import { useRoute } from "vue-router"; // Vue Router의 useRoute 훅 가져오기

export default defineComponent({
  emits: ["updateMakerInfo"], // 상위 컴포넌트로 데이터를 전달할 이벤트 정의
  setup(_, { emit }) {
    const route = useRoute(); // 현재 라우트 객체 가져오기
    const projectId = route.params.projectId; // URL에서 projectId 추출

    const state = reactive({
      makerType: "personal", // 초기값을 개인으로 설정
      ssnFront: "",
      ssnBack: "",
      representativeName: "",
      representativeEmail: "",
      /*businessLicense: null,*/
      businessNumber: "",
      companyName: "",
    });

    const setMakerType = (type) => {
      state.makerType = type;
      emitData(); // makerType 변경 시 상위 컴포넌트로 데이터 전송
    };

    const emitData = () => {
      const data = {
        makerType: state.makerType,
        representativeName: state.representativeName,
        representativeEmail: state.representativeEmail,
        ssnFront: state.makerType === "personal" ? state.ssnFront : null,
        ssnBack: state.makerType === "personal" ? state.ssnBack : null,
        // businessLicense: state.makerType === "business" ? state.businessLicense : null,
        businessNumber: state.makerType === "business" ? state.businessNumber : "",
        companyName: state.makerType === "business" ? state.companyName : "",
      };
      emit("updateMakerInfo", data); // 상위 컴포넌트로 데이터 전달
    };

    const moveFocusToNext = () => {
      if (state.ssnFront.length === 6) {
        // 주민등록번호 앞 6자리가 입력되면 다음 필드로 포커스를 이동
        document.querySelector("input[placeholder='*']").focus();
      }
    };

    const fetchMakerInfo = async () => {
      if (!projectId) {
        console.error("Error: projectId is undefined in the route");
        return;
      }
      try {
        const response = await apiWrapper.getData(`/api/studio/${projectId}/info`);
        const data = response.projectInfo; // response에서 projectInfo 직접 추출
        console.log(data);

        state.makerType = data.makerType || "personal";
        state.representativeName = data.repName || "";
        state.representativeEmail = data.repEmail || "";
        if (state.makerType === "personal") {
          if (data.identityCard && data.identityCard.length >= 7) {
            state.ssnFront = data.identityCard.substring(0, 6); // 앞 6자리
            state.ssnBack = data.identityCard.substring(6, 7); // 뒤 1자리
          } else {
            console.error("Invalid identityCard format");
            state.ssnFront = "";
            state.ssnBack = "";
          }
        } else if (state.makerType === "business") {
          state.businessNumber = data.businessRegistNum || "";
          state.companyName = data.companyName || "";
        }
      } catch (error) {
        console.error("Error fetching maker info:", error);
      }
    };

    // 데이터 변경 감지
    watch(state, emitData, { deep: true });

    // 컴포넌트 초기화 시 초기 데이터 전달
    onMounted(() => {
      fetchMakerInfo(); // 컴포넌트 마운트 시 데이터 가져오기
      emitData();
    });


    return {
      state,
      setMakerType,
      emitData,
      moveFocusToNext,
    };
  },
});
</script>

<style scoped>

</style>
