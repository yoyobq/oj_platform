<template>
  <div class="info">
    <el-card :body-style="{ padding: '20px' }">
      时间限制：{{timeLimit}}<br>内存限制：{{memLimit}}<br>
      最佳时间使用：{{minTime}}ms<br>最佳内存使用： {{minMem}}kb<br>
      提交次数：{{submitCount}}<br>
      开始时间：{{startDate}}<br>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'info',
  props: ['submitCount', 'timeLimit', 'memLimit', 'minTime', 'minMem', 'startDate'],
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
    height: 100%
  }
  .info{
    height: 25%;
    margin-bottom: 5%;
  }
</style>