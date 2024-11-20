<template>
  <div class="mt-5">
    <h4 class="fw-bold text-start">검색용 태그(#) <span class="text-danger">*</span></h4>
    <p class="text-muted small text-start">
      프로젝트가 더 잘 검색될 수 있도록 연관성이 높은 태그를 입력해 주세요.<br />
      예시) 캠핑의자 → 캠핑
    </p>

    <!-- 태그 입력 필드 -->
    <input
        type="text"
        class="form-control mt-3"
        v-model="tagInput"
        placeholder="엔터를 누르면 최대 3개까지 태그를 입력할 수 있어요"
        @keyup.enter="addTag"
        :disabled="tags.length >= 3"
    />
    <p class="text-muted small mt-2 text-start">{{ tags.length }}/3개의 태그</p>

    <!-- 태그 표시 -->
    <div class="mt-1 d-flex flex-wrap">
      <span
          v-for="(tag, index) in tags"
          :key="index"
          class="badge bg-primary me-2 mb-2 d-flex align-items-center"
      >
        {{ tag }}
        <!-- 삭제 버튼 추가 -->
        <button type="button" class="btn-close ms-2" aria-label="Close" @click="removeTag(index)"></button>
      </span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    initialData: {
      type: Array,
      default: () => [], // 초기 데이터를 빈 배열로 설정
    },
  },
  emits: ['updateTags'], // 상위로 데이터를 전달하는 이벤트 정의
  setup(props, { emit }) {
    const tagInput = ref(''); // 태그 입력을 위한 v-model 변수
    const tags = ref([]);

    // 초기화: props.initialData를 tags 배열로 변환
    const initializeTags = () => {
      if (Array.isArray(props.initialData)) {
        tags.value = [...props.initialData];
      } else if (typeof props.initialData === "string") {
        tags.value = props.initialData.split(",").map((tag) => tag.trim()).filter(Boolean);
      } else {
        tags.value = [];
      }
    };

    // props.initialData 변경 시 동기화
    watch(
        () => props.initialData,
        () => {
          initializeTags(); // 초기화 로직 호출
        },
        { immediate: true } // 컴포넌트 초기화 시에도 실행
    );

    const addTag = () => {
      const trimmedTag = tagInput.value.trim();
      if (trimmedTag && !tags.value.includes(trimmedTag) && tags.value.length < 3) {
        tags.value.push(trimmedTag);
        tagInput.value = ''; // 입력 필드 초기화
        emit('updateTags', tags.value); // 태그가 추가될 때 상위 컴포넌트에 전달
      }
    };

    const removeTag = (index) => {
      tags.value.splice(index, 1); // 해당 인덱스의 태그 삭제
      emit('updateTags', tags.value); // 태그가 삭제될 때 상위 컴포넌트에 전달
    };

    return {
      tagInput,
      tags,
      addTag,
      removeTag,
    };
  },
};
</script>


<style scoped>
.small {
  font-size: 0.875rem;
}

.badge {
  font-size: 0.9rem;
  text-align: left;
  height: 25px;
  padding-right: 0.5rem;
}

.btn-close {
  font-size: 0.7rem;
}
</style>
