<template>
  <div class="result">
    <el-card :body-style="{ padding: '20px' }">
      <b>正确率： </b><span v-if="correctRate !== ''">{{correctRate}}</span><br>
      <b>本次时间使用： </b><span v-if="realTime !== null">{{realTime}}ms</span><br>
      <b>本次内存使用： </b><span v-if="realMem !== null">{{realMem}}kb</span>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'result',
  props: ['correctRate', 'realTime', 'realMem'],
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
    height: 100%
  }
  .result{
    height: 25%;
  }
</style>