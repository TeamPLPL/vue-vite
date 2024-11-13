<template>
  <div class="container-fluid">
    <div class="row">
      <ProjectSidebar/>

      <!-- Content -->
      <div class="col-lg-9 p-4">
        <!-- 타이틀 -->
        <h2 class="fw-bold text-start">스토리 작성</h2>
        <p class="text-start">메이커님의 프로젝트를 소개해 주세요.</p>
        <hr/>
        <MakerType/>
        <Thumbnail/>
        <IntroductionImages/>
        <ProjectStory/>

        <MyEditor :data="editorData" @update-content="handleEditorContent" />

      </div>
    </div>
  </div>
</template>

<script>
import ProjectSidebar from "./projectComponents/ProjectSidebar.vue";
import MakerType from "./projectComponents/MakerType.vue";
import Thumbnail from "./projectComponents/Thumbnail.vue";
import IntroductionImages from "./projectComponents/IntroductionImages.vue";
import ProjectStory from "./projectComponents/ProjectStory.vue";
import MyEditor from "./projectComponents/MyEditor.vue";
import SearchTag from "./projectComponents/SearchTag.vue";
import apiWrapper from "../../util/axios/axios.js"

export default {
  components: {
    SearchTag,
    ProjectSidebar,
    MakerType,
    Thumbnail,
    IntroductionImages,
    ProjectStory,
    MyEditor
  },
  data() {
    return {
      editorData: '', // DB에서 가져올 데이터를 여기에 저장
      finalContent: '' // MyEditor에서 받은 최종 데이터 저장
    };
  },
  created() {
    this.fetchEditorData(this.$route.params.id); // 컴포넌트가 생성될 때 DB에서 데이터 가져오기
  },
  methods: {
    fetchEditorData(id) { // id를 매개변수로 받음
      apiWrapper.getData(`/api/studio/${id}/info`)
          .then(response => {
            console.log(response.projectInfo.fundingExplanation);
            this.editorData = response.projectInfo.fundingExplanation;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
    },

    handleEditorContent(content) {
      this.finalContent = content; // MyEditor의 업데이트된 데이터 저장
    },

    submitContent(id) {
      apiWrapper.postData(`/studio/${id}/info`, { content: this.finalContent }) // apiWrapper의 postData 사용
          .then(response => {
            console.log('Data submitted:', response.data);
          })
          .catch(error => {
            console.error('Error submitting data:', error);
          });
    }
  }
};
</script>

<style scoped>
#editor {
  height: 400px;
}
</style>
