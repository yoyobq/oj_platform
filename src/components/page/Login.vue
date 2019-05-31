<template>
  <div class="login-wrap">
    <div class="ms-title">{{$t('common.loginPage.formTitle')}}</div>
    <div class="ms-login">
      <el-tabs class="ms-form" v-model="activeName">
        <el-tab-pane :label="$t('common.loginPage.tabsAccount')" name="account">
          <el-form :model="mailLoginForm" :rules="mailRules" ref="mailLoginForm" label-width="0px">
            <el-form-item prop="email">
              <el-input v-model="mailLoginForm.email" prefix-icon="fa fa-user" :placeholder="$t('common.loginPage.email')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="fa fa-lock" :placeholder="$t('common.loginPage.password')" v-model="mailLoginForm.password" @keyup.enter.native="submitForm('mailLoginForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('mailLoginForm')">{{$t('common.loginPage.btnLogin')}}</el-button>
            </div>
            <el-button type="text" class="reg-info" @click="signUp()" ><i class="fa fa-user-plus"></i> {{$t('common.loginPage.verify')}}</el-button>
          </el-form>
        </el-tab-pane>
        <!-- <el-tab-pane :label="$t('common.loginPage.tabsEmail')" name="email">
          <el-form :model="mailLoginForm" :rules="mailRules" ref="mailLoginForm" label-width="0px">
            <el-form-item prop="usermail">
              <el-input v-model="mailLoginForm.usermail" prefix-icon="fa fa-envelope" :placeholder="$t('common.loginPage.email')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" prefix-icon="fa fa-lock" :placeholder="$t('common.loginPage.password')" v-model="mailLoginForm.password" @keyup.enter.native="submitForm('mailLoginForm')"></el-input>
            </el-form-item>
            <div class="login-btn">
              <el-button type="primary" @click="submitForm('mailLoginForm')">{{$t('common.loginPage.btnLogin')}}</el-button>
            </div>
            <el-button type="text" class="reg-info" @click="signUpByMail()"><i class="fa fa-user-plus"></i> {{$t('common.loginPage.regsiter')}}</el-button>
          </el-form>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
const crypto = require('crypto')
export default {
  data: function () {
    return {
      activeName: 'account',
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('message.loginPage.inputName'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('message.loginPage.inputPassword'), trigger: 'blur' }
        ]
      },
      mailLoginForm: {
        email: '',
        password: ''
      },
      mailRules: {
        email: [
          { required: true, message: this.$t('message.loginPage.inputMail'), trigger: 'blur' },
          { type: 'email', message: this.$t('message.loginPage.validMail'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('message.loginPage.inputPassword'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let theForm = {}
          if (formName === 'loginForm') {
            theForm.username = this.loginForm.username
            theForm.password = this.loginForm.password
          } else {
            theForm.email = this.mailLoginForm.email
            theForm.password = this.mailLoginForm.password
          }
          // 将密码加密再传输
          let sha1 = crypto.createHash('sha1')
          sha1.update(theForm.password)
          theForm.password = sha1.digest('hex')
          // 实际使用中我编辑了一个处理axios提交数据的api
          // 好处是，在api里统一格式化提交的数据，处理了错误信息
          // 在这里提供一个直接用axios提交数据的例子
          // this.$axios.get('api/v1/authentications', {
          //   params: { id: 111 },
          //   data: this.loginForm,
          //   transformRequest: this.data
          // })
          //   .then((res) => {
          //     console.log(res)
          //   })
          // 以上是不用api，以下是调用api
          // 参数说明  url， params, success处理， failure处理
          // 提交登录表单
          this.$api.get('authentications', theForm, res => {
            // 找到对应帐号后，先强制清除原有session 及 localStorage 记录（若有），
            // 注意 session保存在服务端，sessionStorage保存在客户端，此间区别要厘清
            // 本站点对session的处理，调用了 vue-session ，详见npm说明文档7
            sessionStorage.clear()
            localStorage.clear()
            // 进入登录流程
            this.loginSuccess(res[0])
          }, res => {
            // 找不到符合条件的用户账户
            this.$message.error(res.data.error)
          })
        }
      })
    },
    async loginSuccess (authInfo) {
      // 记录 uuid 和 id 到 session
      this.setSession(authInfo)
      let id = authInfo.id
      // 根据 id 获取用户基本信息
      // 此处今后应该添加教师信息的分别获取
      const stuInfo = await this.getStuInfo(id)
      if (stuInfo) {
        // 设置登录信息和基本信息到localStorage
        await this.setLocalStorage(stuInfo, authInfo)
        // 写入本次登录的IP和时间
        if (await this.setLoginRecord(id)) {
          // 全部登录流程完成，跳转至主页
          this.$router.push('/')
        }
      } else {
        // 此处为临时处理，请及时修改
        console.log('服务器错误，请重试')
      }
    },
    setLoginRecord (id) {
      // 设置本次登录时间，记录登录IP
      return new Promise((resolve, reject) => {
        let data = { '_csrf': this.$cookies.get('csrfToken') }
        this.$api.put('authentications/' + id, data, res => {
          resolve(true)
        }, res => {
          resolve(false)
        })
      })
    },
    getStuInfo (id) {
      return new Promise((resolve, reject) => {
        this.$api.get('stuInfos/' + id, null, res => {
          // 获取对应id的用户信息，将信息存在localStorage中，方便调用
          resolve(res)
        }, res => {
          console.log(res.data.error)
          resolve(false)
        })
      })
    },
    async setSession (res) {
      sessionStorage.setItem('uuid', res.uuid)
      sessionStorage.setItem('id', res.id)

      let permitList = res.permission
      let permissionStr = ''
      permitList = JSON.parse(permitList)
      if (permitList[1] === 2 || permitList[0] === 2) {
        sessionStorage.setItem('permissionId', '2')
      }
      permissionStr = JSON.stringify(await this.computePermission(permitList))
      sessionStorage.setItem('permission', permissionStr)
    },
    async computePermission (permitList) {
      let finalPermit = {}
      for (let permitNo of permitList) {
        var permit = await this.getPermission(permitNo)
        // console.log(typeof permit)
        // forbidden > execute > read > ''
        permit = JSON.parse(permit)
        for (let page in permit) {
          if (finalPermit[page] === undefined) {
            finalPermit[page] = permit[page]
          } else if (permit[page] === 'forbidden') {
            finalPermit[page] = 'forbidden'
          } else if (finalPermit[page] !== 'forbidden' && permit[page] === 'execute') {
            finalPermit[page] = 'execute'
          } else if (finalPermit[page] !== 'forbidden' && finalPermit[page] !== 'execute' && permit[page] === 'read') {
            finalPermit[page] = 'read'
          }
        }
      }
      return finalPermit
    },
    setLocalStorage (stuInfo, authInfo) {
      // classId: 61 departmentId: 4 id: 2 stuId: 318010501 realName: "测试学生" sex: 0 specialityId: 42
      // isInSchoolRoll: 1 isInternship: 0 isStay: 1 isStuding: 1  specialityId: 42  eduBack: "三校生" grade: "2018" idNumber: "32050319840113176X"
      // 以下这种做法有个很大的缺点，每一个用户登录数据库都要访问数据库4，5次，
      // 并涉及到5张表里，以后有时间了需要做一个view，简化固定数据的访问过程
      return new Promise(async (resolve, reject) => {
        localStorage.setItem('realName', stuInfo.realName)
        localStorage.setItem('sex', stuInfo.sex)
        localStorage.setItem('stuId', stuInfo.stuId)
        if (stuInfo.classId !== null) {
          localStorage.setItem('classId', stuInfo.classId)
          localStorage.setItem('className', await this.getClassName(stuInfo.classId))
        }
        if (stuInfo.departmentId !== null) {
          localStorage.setItem('departmentId', stuInfo.departmentId)
          localStorage.setItem('departmentName', await this.getDepartmentName(stuInfo.departmentId))
          localStorage.setItem('eduBack', stuInfo.eduBack)
          // localStorage.setItem('cellphone', stuInfo.stuId)
        }
        if (stuInfo.specialityId !== null) {
          localStorage.setItem('specialityId', stuInfo.specialityId)
          localStorage.setItem('specName', await this.getSpecName(stuInfo.specialityId))
        }
        localStorage.setItem('email', authInfo.email)
        localStorage.setItem('lastLoginIp', authInfo.lastLoginIp)
        localStorage.setItem('lastLoginTime', authInfo.lastLoginTime)
        localStorage.setItem('avatarPath', 'static/img/' + authInfo.avatarPath)
        // 9+4 共13组在 localStorage 中的数据
        resolve(true)
      })
    },
    getPermission (permissionId) {
      return new Promise((resolve, reject) => {
        this.$api.get('permissions/' + permissionId, null, res => {
          // let permit = JSON.parse(res.permissionStr)
          // console.log(permit)
          resolve(res.permissionStr)
        }, res => {
          reject(new Error('获取许可信息出错'))
        })
      })
    },
    signUpByMail () {
      this.$router.push('/signUpByMail')
    },
    signUp () {
      this.$router.push('/signUpByIdentity')
    },
    getClassName (id) {
      return new Promise((resolve, reject) => {
        this.$api.get('classInfos/' + id, null, res => {
          // 此处请注意 根据eggjs的RESTful接口设定，通过id获取信息利用的是
          // 对应 controllor 的 show() 方法，因此返回的是唯一行，不可能是多行
          // 因此 返回的不是数组，而是单行的json字符串
          resolve(res.className)
        }, res => {
          reject(new Error('获取班级信息出错'))
        })
      })
    },
    getDepartmentName (id) {
      return new Promise((resolve, reject) => {
        this.$api.get('departments/' + id, null, res => {
          resolve(res.departmentName)
        }, res => {
          reject(new Error('获取系部信息出错'))
        })
      })
    },
    getSpecName (id) {
      return new Promise((resolve, reject) => {
        this.$api.get('specialities/' + id, null, res => {
          resolve(res.specName)
        }, res => {
          reject(new Error('获取专业信息出错'))
        })
      })
    }
  }
}
</script>

<style scoped>
.login-wrap{
    position: relative;
    width:100%;
    height:100%;
}
.ms-title{
    position: absolute;
    top:50%;
    width:100%;
    margin-top: -230px;
    text-align: center;
    font-size:30px;
    color: #fff;

}
.ms-login{
    position: absolute;
    left:50%;
    top:50%;
    width:300px;
    height:160px;
    margin:-150px 0 0 -190px;
    padding: 15px 40px 85px 40px;
    border-radius: 5px;
    background: #fff;
}

.ms-form {
    /* padding:0px 0px 0px 0px; */
}

.login-btn{
    text-align: center;
}

.login-btn button{
    width:100%;
    height:36px;
}

.reg-info {
  padding-top: 20px;
  /* font-size: 14px;
  line-height:30px;
  color: #C0C4CC; */
  float: right;
}
</style>