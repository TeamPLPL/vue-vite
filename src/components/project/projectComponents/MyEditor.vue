<template>
  <div class="mt-4">
    <div class="container-fluid">
      <div class="row">
        <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
          <div class="editor-container__editor">
            <div ref="editorElement">
              <ckeditor v-if="isLayoutReady" v-model="editorData" :editor="editor" :config="config" @input="onEditorInput"/>
            </div>
          </div>
        </div>
        <!-- 콘텐츠 영역 -->
        <div class="col-md-9">
          <div class="content-area">
            <p></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ClassicEditor,
  AccessibilityHelp,
  Autoformat,
  Autosave,
  BlockQuote,
  Bold,
  CloudServices,
  Essentials,
  Heading,
  Indent,
  IndentBlock,
  Italic,
  List,
  ListProperties,
  Paragraph,
  PasteFromOffice,
  SelectAll,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

export default {
  name: "MyEditor",
  data() {
    return {
      isLayoutReady: false,
      editorData: "",
      config: null, // CKEditor needs the DOM tree before calculating the configuration.
      editor: ClassicEditor
    };
  },
  mounted() {
    this.config = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'insertTable',
          'blockQuote',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'outdent',
          'indent'
        ],
        shouldNotGroupWhenFull: false
      },
      plugins: [
        AccessibilityHelp,
        Autoformat,
        Autosave,
        BlockQuote,
        Bold,
        CloudServices,
        Essentials,
        Heading,
        Indent,
        IndentBlock,
        Italic,
        List,
        ListProperties,
        Paragraph,
        PasteFromOffice,
        SelectAll,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        Undo
      ],
      heading: {
        options: [
          { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
          { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
          { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
        ]
      },
      placeholder: 'Type or paste your content here!',
      language: 'ko',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
      }
    }

    this.isLayoutReady = true;
  },
  methods: {
    onEditorInput(content) {
      // 에디터에서 입력된 내용을 상위 컴포넌트로 전달
      this.$emit("updateExplanation", this.editorData);
    },
  },
};
</script>

<style>
.ck.ck-editor {
  max-width: 700px;
  float: left; /* 왼쪽에 고정 */
}
.ck.ck-editor__editable_inline {
  min-height: 300px;
  height: 400px;
}
</style>
<script setup lang="ts">
</script>