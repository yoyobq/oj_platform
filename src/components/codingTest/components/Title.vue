<template>
  <div class="title">
    <el-card :body-style="{ padding: '20px' }">
      <div class="topic"><b>题目标题：</b> {{topic}}</div><br>
      <div class="describe"><b>问题描述：</b> {{describe}}</div><br>
      <div class="hint"><b>编程提示：</b> {{hint}}</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'vtitle',
  props: ['topic', 'describe', 'hint'],
  data () {
    return {
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
  }
}
</script>
<style>
  .el-card{
    margin:10px;
    height: 50%;
    height: 100%;
    overflow-y: auto;
  }
  .title{
    height: 40%;
    margin-bottom: 5%;
  }
</style>