<template>
  <el-dialog title="第 2 步（共 3 步）：请核对并确认你的个人信息" :visible.sync="chkInfoShow" width="640px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-card class="stu-card" v-for="(stuInfo,index) in data" :key="index">
      <div slot="header" class="clearfix">
        <span class="fa fa-user-circle-o  name-text"> {{ stuInfo.姓名 }}</span>
        <span>{{ stuInfo.证件号码 }}</span>
        <el-button class="card-button" type="success" plain @click="signIn(stuInfo)">我确认</el-button>
      </div>
      <div>
        <ul class="stu-ul">
          <li>所属系部：{{ stuInfo.所在学部 }}</li>
          <li>所在班级：{{ stuInfo.所在班级 }}</li>
          <li>学号：{{ stuInfo.学号 }}</li>
        </ul>
      </div>
    </el-card>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCheck">回到上一步</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'chkInfoDialog',
  props: ['chkInfoShow', 'data'],
  methods: {
    cancelCheck () {
      this.$emit('update:chkedInfo', null)
      this.$emit('update:chkInfoShow', false)
    },
    signIn (chkedInfo) {
      let data = {
        'idNumber': chkedInfo.证件号码
      }
      this.$api.get('stuInfos', data, res => {
        // console.log(res[0].id)
        this.$message({
          type: 'info',
          message: '该学生已注册（ id:' + res[0].id + ' ），若不是本人注册，请及时联系管理员'
        })
      }, res => {
        this.$emit('update:chkInfoShow', false)
        this.$emit('update:chkedInfo', chkedInfo)
      })
    }
  },
  watch: {
    chkInfoShow: function () {
    },
    data: function () {
    }
  },
  computed: {

  }
}
</script>

<style scoped>
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .name-text{
    font-size: 20px;
    font-weight: 500;
    color: #409EFF;
    padding-right: 30px;
  }

  .card-button {
    float: right;
    /* padding: 3px 0; */
    font-size: 12px;
  }

  .stu-card {
    /* width: 200px; */
  }

  .stu-ul {
    list-style-type: none;
    font-size: 12px;
    font-weight: 500;
  }

  .stu-ul li {
    padding-right: 30px;
    display: inline;
  }
</style>
