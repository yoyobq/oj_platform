<template>
  <div class="code">
    <el-card :body-style="{ padding: '20px' }">
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
  props: ['preCode', 'editorOption'],
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
  .codemirror{
    height: 100%
  }
  .CodeMirror{
    height: 100%
  }
  .code{
    height: 80%;
  }
</style>