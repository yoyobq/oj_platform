<template>
  <div class="result">
    <el-card :body-style="{ padding: '20px' }">
      <b>{{$t('common.codingTest.correctRate')}}： </b><span v-if="correctRate !== ''">{{correctRate}}</span><br>
      <b>{{$t('common.codingTest.realTime')}}： </b><span v-if="realTime !== null">{{realTime}}ms</span><br>
      <b>{{$t('common.codingTest.realMem')}}： </b><span v-if="realMem !== null">{{realMem}}kb</span>
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
    height: 30%;
  }
</style>