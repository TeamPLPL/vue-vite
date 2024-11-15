<template>
  <div class="mt-4">
    <div class="container-fluid">
      <div class="row">
        <!-- 왼쪽 고정된 CKEditor 영역 -->
        <div class="col-md-3">
          <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
            <div class="editor-container__editor">
              <ckeditor
                  v-if="isLayoutReady"
                  v-model="localEditorData"
                  :editor="editor"
                  :config="config"
                  @input="updateContent"
              />
            </div>
          </div>
        </div>

        <!-- 오른쪽 콘텐츠 영역 -->
        <div class="col-md-9">
          <div class="content-area">
            <!-- 여기에 오른쪽의 다른 콘텐츠를 배치할 수 있습니다 -->
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
  name: 'MyEditor',
  props: {
    data: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isLayoutReady: false,
      localEditorData: this.data || '', // 초기값 설정
      config: null,
      editor: ClassicEditor
    };
  },
  watch: {
    data(newData) {
      this.localEditorData = newData || ''; // NULL 값을 빈 문자열로 처리
    }
  },
  methods: {
    updateContent() {
      this.$emit('update-content', this.localEditorData);
    }
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
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph'
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1'
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2'
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3'
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4'
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5'
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6'
          }
        ]
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true
        }
      },
      placeholder: 'Type or paste your content here!',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
      }
    };

    // 초기 데이터 설정: localEditorData가 비어 있을 때만 initialData를 기본값으로 설정
    if (!this.localEditorData) {
      this.localEditorData = '<h3>안녕하세요. 스토리 작성을 시작한 메이커님을 환영해요!</h3><ul><li><p>아래는 스토리를 쉽게 작성할 수 있도록 안내를 드리는 문구예요. 스토리를 어떻게 작성할지 고민이 된다면 참고해 보세요.</p></li><li><p>프로젝트 제출 이후, <strong><u>와디즈는 메이커님 대신 스토리를 작성해 드리지 않아요.</u></strong> 메이커님의 이야기를 생생하게 담고, 진심을 그대로 전하기 위함이니 이해해 주세요.</p></li><li><p>이 문구는 메이커님께만 비밀리에 보여 드리는 내용이에요. 문구가 그대로 상세 페이지에 노출되면 서포터님들이 당황할 수 있으니 <strong><u>문구를 다 읽었다면, 지워 주세요.</u></strong></p></li></ul><p><br></p><p>이제 안내 문구를 보면서 스토리를 하나씩 작성해 볼까요?</p>';
    }

    this.isLayoutReady = true;
  }
};
</script>

<style>
.ck.ck-editor {
  max-width: 800px;
  float: left; /* 왼쪽에 고정 */
}
.ck.ck-editor__editable_inline {
  min-height: 300px;
  height: 400px;
}
</style>
