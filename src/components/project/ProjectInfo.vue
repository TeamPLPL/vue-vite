<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3 border-end d-none d-lg-block sidebar-fixed-width">
        <!-- ProjectSidebar에 projectId 바인딩 -->
        <ProjectSidebar :projectId="projectId" />
        <button class="btn btn-primary w-100" @click="saveProject">저장 하기</button>
      </div>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <!-- 타이틀 -->
        <h2 class="fw-bold text-start">프로젝트 작성</h2>
        <p class="text-start">메이커님의 프로젝트를 소개해 주세요.</p>
        <hr />
        <MakerType />
        <Thumbnail />
        <IntroductionImages />
        <ProjectStory />

        <!-- MyEditor에 초기 데이터 전달 -->
        <MyEditor :data="editorData" @update-content="handleEditorContent" />

        <SearchTag />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
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
      editorData: "", // DB에서 가져올 데이터를 여기에 저장
      finalContent: "", // MyEditor에서 받은 최종 데이터 저장
    };
  },
  created() {
    // DB에서 데이터 가져오기
    this.fetchEditorData(this.$route.params.projectId);
  },
  methods: {
    fetchEditorData(projectId) {
      // projectId를 매개변수로 API 호출
      apiWrapper
          .getData(`/api/studio/${projectId}/project`)
          .then((response) => {
            console.log(response.projectInfo.fundingExplanation);
            this.editorData = response.projectInfo.fundingExplanation;
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
    },
    handleEditorContent(content) {
      this.finalContent = content; // MyEditor의 업데이트된 데이터 저장
    },
    submitContent(projectId) {
      // API POST 호출
      apiWrapper
          .postData(`/studio/${projectId}/info`, { content: this.finalContent })
          .then((response) => {
            console.log("Data submitted:", response.data);
          })
          .catch((error) => {
            console.error("Error submitting data:", error);
          });
    },
    async saveProject() {
      try {
        // DTO 객체 생성
        const requestBody = {
          fundingStartDate: startDateTime,
          fundingEndDate: endDateTime,
        };

        console.log("전송 데이터:", requestBody); // 디버깅용

        // 서버 요청
        const response = await apiWrapper.postData(`/api/studio/${this.projectId}/schedule`, requestBody);

        if (response.status === 200) {
          alert("프로젝트 일정이 성공적으로 저장되었습니다.");
          this.$router.push(`/studio/${this.projectId}/project/`); // 페이지 이동
          console.log("응답 데이터:", response.data);
        }
      } catch (error) {
        console.error("저장 중 오류 발생:", error);
        alert("프로젝트 일정 저장 중 오류가 발생했습니다.");
      }
    },
  },
});
</script>

<style scoped>
#editor {
  height: 400px;
}
</style>
