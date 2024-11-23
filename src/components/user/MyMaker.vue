<template>
  <div class="container-fluid">
    <div class="row">
      <ProfileSidebar />

      <!-- Main Content -->
      <div class="col-lg-9 p-4">
        <!-- Project Section -->
        <div class="mb-4">
          <h4 class="fw-bold text-start">메이커 홈</h4>
          <div class="border mt-4 p-4 text-center rounded d-flex flex-column" style="border-radius: 15px; min-height: 300px;">
            <p class="fw-bold mb-1">새로운 도전을 시작해 보세요</p>
            <p class="text-muted">개인 후원부터 제품 · 콘텐츠 · 서비스 출시, 성장까지 와디즈가 함께할게요</p>

            <!-- 프로젝트 카드 -->
            <div v-for="project in projects" :key="project.id" class="d-flex border mb-3 p-3 rounded" style="min-height: 150px;">
              <div class="position-relative" style="width: 150px; height: 150px;">
                <!-- 썸네일이 있을 경우 -->
                <img v-if="project.thumbnail" :src="project.thumbnail.signedUrl" alt="thumbnail" style="object-fit: cover; width: 100%; height: 100%; border-radius: 15px;">
                <!-- 썸네일이 없을 경우 -->
                <img v-if="!project.thumbnail" src="../../../public/noimage.png" alt="no thumbnail" style="object-fit: cover; width: 100%; height: 100%; border-radius: 15px;">
              </div>
              <!-- 내용 -->
              <div class="ms-3 d-flex flex-column flex-grow-1 position-relative">
                <!-- 배지 -->
                <span class="badge position-absolute" :class="{'bg-primary': !project.isPublished, 'bg-success': project.isPublished}" style="top: 0; left: 0;">{{ project.status }}</span>

                <!-- 내용 -->
                <div class="d-flex flex-column text-start mt-4">
                  <h6 class="mt-2 mb-1">프로젝트 번호: <span class="text-primary">{{ project.id }}</span></h6>
                  <p class="mt-2 mb-0">프로젝트 제목: {{ project.fundingTitle }}</p>
                </div>
                <div v-if="!project.isPublished" class="mt-auto d-flex justify-content-end">
                  <button class="btn btn-primary me-2" style="width: 100px; font-size: small;" @click="continueProject(project.id)">이어서 작성</button>
                  <button class="btn btn-danger" style="width: 100px; font-size: small;" @click="deleteProject(project.id)">삭제</button>
                </div>
                <div v-if="project.isPublished" class="mt-auto d-flex justify-content-end">
                  <button class="btn btn-success" style="width: 100px; font-size: small;" @click="fundingdetail(project.id)">발행글 이동</button>
                </div>
              </div>
            </div>


            <button class="btn btn-primary w-100 mt-auto" @click="createProject">프로젝트 만들기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import apiWrapper from "../../util/axios/axios.js"
import ProfileSidebar from "./userComponents/ProfileSidebar.vue";
import {useRouter} from "vue-router";
import Info from "./userComponents/Info.vue";
import axios from "../../util/axios/axios.js";

export default {
  components : {
    Info,
    ProfileSidebar,
  },
  data() {
    return {
      projects: [], // 프로젝트 데이터 저장
    };
  },
  setup() {
    const router = useRouter();
    const ispublished = ref('false');

    const fundingdetail = (projectId) => {
      router.push(`/funding/${projectId}/detail`);
    }

    const createProject = () => {
      // 프로젝트 생성 여부 확인
      if (confirm('프로젝트를 생성하시겠습니까?')) {
        const startProject = async () => {
          try {
            const response = await apiWrapper.getData('/api/studio/start');
            const projectId = response.projectId;

            alert(`프로젝트가 생성되었습니다! 프로젝트 ID: ${projectId}`);
            router.push(`/studio/${projectId}/project`);
          } catch (error) {
            console.error('프로젝트 시작 오류:', error);
            alert('프로젝트 생성 중 오류가 발생했습니다.');
          }
        };
        startProject();
      } else {
        console.log('프로젝트 생성 취소');
        alert('프로젝트 생성이 취소되었습니다.');
      }
    };

    const deleteProject = async (projectId) => {
      if (confirm("프로젝트를 삭제하시겠습니까?")) {
        try {
          // DELETE API 호출
          const response = await apiWrapper.getData(`/api/studio/${projectId}/delete`);
          console.log(`프로젝트 ${projectId} 삭제 성공`, response);
          alert(`프로젝트 ${projectId}가 삭제되었습니다.`);

          // projects 배열에서 삭제된 프로젝트 제거
          window.location.reload()
        } catch (error) {
          console.error(`프로젝트 ${projectId} 삭제 실패`, error);
          alert("프로젝트 삭제에 실패했습니다. 다시 시도해주세요.");
        }
      }
    };

    const continueProject = async (projectId) => {
      try {
        // 프로젝트 API 호출
        const response = await apiWrapper.getData(`/api/studio/${projectId}/project`);
        console.log(`프로젝트 ${projectId} 이어서 작성 호출 성공`, response);
        router.push(`/studio/${projectId}/project`);

      } catch (error) {
        console.error(`프로젝트 ${projectId} 이어서 작성 호출 실패`, error);
        alert("프로젝트를 불러오는 데 실패했습니다. 다시 시도해주세요.");
      }
    };


    return {
      createProject,
      deleteProject,
      continueProject,
      ispublished,
      fundingdetail
    }
  },
  async mounted() {
    try {
      const response = await apiWrapper.getData("/api/studio/projectslist"); // 프로젝트 리스트 API 호출
      console.log(response);
      this.projects = response.map((project) => {
        return {
          id: project.id,
          fundingTitle: project.fundingTitle,
          thumbnail: project.thumbnail,
          status: project.published ? "발행됨" : "작성중", // isPublished에 따라 상태 설정
          isPublished: project.published || false, // isPublished 값을 추가
        };
      });
    } catch (error) {
      console.error("프로젝트 데이터를 불러오는 중 오류 발생:", error);
    }
  },
}
</script>



<style scoped>
.profile{
  width: 80px; /* 원하는 이미지 크기 */
  height: 80px; /* 원하는 이미지 크기 */
  border-radius: 50%; /* 원형으로 만듦 */
  object-fit: cover; /* 이미지가 원 안에 꽉 차게 조정 */
}

badge {
  font-size: 0.9rem;
}

.card img {
  object-fit: cover;
}
</style>