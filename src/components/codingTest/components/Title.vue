<template>
  <div class="title">
    <el-card :body-style="{ padding: '20px' }">
      <div class="topic"><b>{{$t('common.codingTest.topic')}}：</b> {{topic}}</div><br>
      <div class="describe"><b>{{$t('common.codingTest.describe')}}：</b> {{describe}}</div><br>
      <div class="hint"><b>{{$t('common.codingTest.hint')}}：</b> {{hint}}</div>
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
    height: 45%;
    margin-bottom: 5%;
  }
</style>