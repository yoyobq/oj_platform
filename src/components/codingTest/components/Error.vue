<template>
  <div class="error">
    <el-card :body-style="{ padding: '20px' }">
      <b>错误提示： </b><span style="color:red;">{{errMsg}}</span>
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
    height: 25%;
    margin-bottom: 5%;
  }
</style>