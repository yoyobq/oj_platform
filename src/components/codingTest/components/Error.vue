<template>
  <div class="error">
    <el-card class="error-el-card" :body-style="{ padding: '20px' }">
      <PRE><b>错误提示： </b><span style="color:red;">{{errMsg}}</span></PRE>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'error',
  props: ['errMsg'],
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
  .error{
    height: 30%;
    margin-bottom: 5%;
  }
  .error-el-card{
    overflow-x: auto;
  }
</style>