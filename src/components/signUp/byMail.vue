<template>
  <div class="login-wrap">
    <chkInfo :chkInfoShow="chkInfoShow" @update:chkInfoShow="chkInfoShow = $event" :data="stuInfo" @update:chkedInfo="chkedInfo = $event"></chkInfo>
    <createForm :createShow="createShow" @update:createShow="createShow = $event" :data="chkedInfo"></createForm>
  </div>
</template>

<script>
export default {
  name: 'signUpByMail',
  components: {
    'chkInfo': resolve => { require(['@/components/signUp/byMail/chkInfoDialog.vue'], resolve) },
    'createForm': resolve => { require(['@/components/signUp/byMail/createForm.vue'], resolve) }
  },
  data: function () {
    return {
      idNumber: '',
      stuInfo: [],
      chkedInfo: null,
      chkInfoShow: false,
      createShow: true
    }
  },
  created () {
    // this.checkId()
  },
  watch: {
    chkInfoShow: function () {
      if (this.chkInfoShow === false) {
        if (this.chkedInfo !== null) {
          // console.log(this.chkedInfo)
          this.signUp()
        } else {
          this.checkId()
        }
      }
    },
    createShow: function () {
      if (this.createShow === false && this.chkedInfo !== null) {
        this.checkInfo()
      } else {
        this.signUp()
      }
    }
  },
  methods: {
    // 2 显示核对个人信息dialog
    checkInfo () {
      this.chkInfoShow = true
    },
    // 3 根据chkedInfo注册账户
    signUp () {
      this.createShow = true
    },
    // 1 弹出输入身份证并检查对应信息messagebox
    checkId () {
      this.chkedInfo = null
      this.stuInfo = null
      console.log('320586200001043618') // 此号码旧数据中有冗余
      // this.$prompt(this.$t('message.signUp.inputIdNo'), '第 1 步（共 3 步）', {
      this.$prompt('', '第 1 步（共 3 步）：' + this.$t('message.signUp.inputIdNo'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // 大陆18位  |  大陆 15位 | 香港 | 台湾 | 澳门
        inputPattern: /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)|([A-Z]{1,2}[0-9]{6}([0-9A]))|([A-Z][0-9]{9})|(^[1|5|7][0-9]{6}\([0-9Aa]\))/,
        inputErrorMessage: '身份证号不完整或格式不正确',
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(({ value }) => {
        this.idNumber = value
        let data = {
          '证件号码': this.idNumber
        }
        this.$api.get('stuFullInfos', data, res => {
          // 注意，这里返回了一个json数组
          // console.log(res)
          this.stuInfo = res
          this.checkInfo()
        }, res => {
          // console.log(res)
          this.$message({
            duration: 6000,
            message: res.data.error,
            type: 'warning'
          })
          this.checkId()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>
/* .login-wrap{
    position: relative;
    width:100%;
    height:100%;
    background-color: #324157;
} */

.el-message {
  z-index: 999;
}
</style>