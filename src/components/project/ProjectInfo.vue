<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
        <!-- ProjectSidebar에 projectId 바인딩 -->
        <ProjectSidebar :projectId="projectId"/>
        <button class="btn btn-primary w-100" @click="saveProject">저장 하기</button>
      </div>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <!-- 타이틀 -->
        <h2 class="fw-bold text-start">프로젝트 작성</h2>
        <p class="text-start">메이커님의 프로젝트를 소개해 주세요.</p>
        <hr/>
        <MakerType @updateMakerInfo="updateMakerInfo"/>

        <Thumbnail/>

        <IntroductionImages/>

        <ProjectStory/>

        <!-- MyEditor에 초기 데이터 전달 -->
        <MyEditor @updateExplanation="updateFundingExplanation"/>

        <!-- SearchTag에서 태그를 업데이트 -->
        <SearchTag @updateTags="updateFundingTags" />
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent, reactive} from "vue";
import {useRoute} from "vue-router";
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import MakerType from "./projectComponents/MakerType.vue";
import Thumbnail from "./projectComponents/Thumbnail.vue";
import IntroductionImages from "./projectComponents/IntroductionImages.vue";
import ProjectStory from "./projectComponents/ProjectStory.vue";
import MyEditor from "./projectComponents/MyEditor.vue";
import SearchTag from "./projectComponents/SearchTag.vue";
import apiWrapper from "../../util/axios/axios.js";

export default defineComponent({
  components: {
    SearchTag,
    ProjectSidebar,
    MakerType,
    Thumbnail,
    IntroductionImages,
    ProjectStory,
    MyEditor,
  },
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fundingTag: "", // SearchTag에서 전달받은 태그를 저장
    };
  },
  methods: {
    updateFundingExplanation(content) {
      // MyEditor에서 전달받은 데이터를 업데이트
      this.fundingExplanation = content;
      console.log("Updated fundingExplanation:", this.fundingExplanation);
    },
    updateFundingTags(tags) {
      // 배열을 문자열로 변환 (쉼표로 구분)
      this.fundingTag = tags.join(",");
      console.log("Updated fundingTag:", this.fundingTag);
    },
    async saveProject() {
      try {
        // DTO 객체 생성
        const requestBody = {
          makerType: this.makerInfo.makerType,          // 개인/사업자 타입 (makerType)
          repName: this.makerInfo.representativeName,  // 대표자명 (representativeName)
          repEmail: this.makerInfo.representativeEmail,// 대표자 이메일 (representativeEmail)
          identityCard: this.makerInfo.ssnFront + this.makerInfo.ssnBack, // 주민등록번호 (ssnFront, ssnBack)

          businessRegistNum: this.makerInfo.businessNumber,     // 사업자 등록 번호 (businessNumber)
          companyName: this.makerInfo.companyName,              // 회사 이름 (companyName)

          fundingExplanation: this.fundingExplanation,          // 펀딩 설명 (fundingExplanation)
          fundingTag: this.fundingTag,                          // 펀딩 태그 (fundingTag)
        };

        console.log("전송 데이터:", requestBody); // 디버깅용

        // 서버 요청
        const response = await apiWrapper.postData(`/api/studio/${this.projectId}/info`, requestBody);

        if (response.status === 200) {
          alert("프로젝트 일정이 성공적으로 저장되었습니다.");
          this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
          console.log("응답 데이터:", response.data);
        }
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
        alert("프로젝트 정보 저장 중 오류가 발생했습니다.");
      }
    },
  },
  setup() {
    const makerInfo = reactive({
      makerType: "",
      representativeName: "",
      representativeEmail: "",
      ssnFront: "",
      ssnBack: "",
      businessNumber: "",
      companyName: "",
    });

    // MakerType 데이터를 포함한 상태 관리 객체
    const updateMakerInfo = (data) => {
      Object.assign(makerInfo, data); // 전달받은 데이터를 상태에 반영
    };

    return {
      makerInfo,
      updateMakerInfo,
    };
  },
});
</script>

<style scoped>
#editor {
  height: 400px;
}
</style>
