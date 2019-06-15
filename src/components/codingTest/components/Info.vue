<template>
  <div class="info">
    <el-card :body-style="{ padding: '20px' }">
      <b>{{$t('common.codingTest.timeLimit')}}：</b>{{timeLimit}}<br><b>{{$t('common.codingTest.memLimit')}}：</b>{{memLimit}}<br>
      <b>{{$t('common.codingTest.minTime')}}：</b>{{minTime}}ms<br><b>{{$t('common.codingTest.minMem')}}：</b>{{minMem}}kb<br>
      <b>{{$t('common.codingTest.submitCount')}}:</b>{{submitCount}}<br>
      <b>{{$t('common.codingTest.startDate')}}：</b>{{startDate}}<br>
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
    height: 30%;
    margin-bottom: 5%;
  }
</style>