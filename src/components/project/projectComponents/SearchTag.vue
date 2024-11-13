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
import { ref } from 'vue';

export default {
  setup() {
    const tagInput = ref(''); // 태그 입력을 위한 v-model 변수
    const tags = ref([]); // 태그 저장을 위한 배열

    const addTag = () => {
      const trimmedTag = tagInput.value.trim();
      // 입력된 값이 비어있지 않고, 중복되지 않으며, 태그가 3개 이하 때만 추가
      if (trimmedTag && !tags.value.includes(trimmedTag) && tags.value.length < 4) {
        tags.value.push(trimmedTag);
        tagInput.value = ''; // 입력 필드 초기화
      }
    };

    const removeTag = (index) => {
      tags.value.splice(index, 1); // 해당 인덱스의 태그 삭제
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
