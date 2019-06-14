<template>
  <div class="testCase">
    <el-card :body-style="{ padding: '20px' }">
      <div><b>示例</b></div><br>
      <div>输入： {{inputCase}}</div><br>
      <div>输出： {{outputCase}}</div><br>
    </el-card>
  </div>
  
</template>
<script>
export default {
  name: 'testcase',
  props: ['cqId'],
  data () {
    return {
      uId: sessionStorage.getItem('id'),
      inputCase: '',
      outputCase: ''
    }
  },
  computed: {
  },
  created () {
    let data = {
      cqId: this.cqId
    }
    this.$api.get('testcases', data, res => {
      this.inputCase = (JSON.parse(res[0].inputData))[0]
      this.outputCase = (JSON.parse(res[0].outputData))[0]
    }, res => {})
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
  .testCase{
    height: 45%;
  }
</style>