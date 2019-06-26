<template>
  <div class="code">
    <el-card class="codePage" :body-style="{ padding: '20px' }">
      <div slot="header" class="clearfix">
        <el-select v-model="programLang">
          <el-option label="Javascript" value="Javascript"></el-option>
          <el-option label="Java" value="Java"></el-option>
          <el-option label="C" value="C"></el-option>
          <el-option label="C++" value="C++"></el-option>
        </el-select>
      </div>
      <codemirror class="codemirror" :value="preCode"
        :options="editorOption"
        ref="myEditor">
        <!-- @change="yourCodeChangeMethod"> -->
      </codemirror>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'code',
  props: ['preCode', 'editorOption', 'programLang'],
  data () {
    return {
    }
  },
  computed: {
    editor () {
      // 获得现有的 editor 对象
      return this.$refs.myEditor.editor
    }
  },
  created () {
  },
  mounted () {
    this.editor.focus()
  },
  methods: {
  }
}
</script>
<style>
  .CodeMirror{
    height: 100%;
    background-color: rgb(34, 32, 39);
  }
  .code{
    height: 90%;
  }
  .codePage{
    background-color: rgb(34, 32, 39);
  }
  .CodeMirror-gutter{
    background-color: rgb(34, 32, 39);
  }
  .CodeMirror pre{
    color: white;
  }

  .CodeMirror-cursor {
    border-left: 1px solid white !important;
  }
  .cm-s-default .cm-variable-2{
    color: #9dceff;
  }
  .cm-s-default .cm-keyword{
    color: #f9cfff;
  }
  .cm-s-default .cm-def{
    color: #b4b4ff;
  }
  .cm-s-default .cm-number{
    color: #baffe3;
  }
  .codePage .el-card__header{
    background-color: rgb(66, 61, 78);
    border-bottom: 1px solid rgb(66, 61, 78);
  }
</style>