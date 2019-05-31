<template>
  <el-dialog :title="$t('common.signUp.registerConfirm')" :visible.sync="createShow" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <el-form :model="authInfo" :rules="authRules" ref="authInfo">
      <el-form-item :label="$t('common.signUp.stuId')" :label-width="formLabelWidth" prop="stuId">
        <el-input v-model.trim="authInfo.stuId" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.signUp.realName')" :label-width="formLabelWidth" prop="realName">
        <el-input v-model.trim="authInfo.realName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.signUp.email')" :label-width="formLabelWidth" prop="email">
        <el-input v-model.trim="authInfo.email" auto-complete="off" :disabled="isVerifyEmail">
          <el-button v-if="!isVerifyEmail" slot ="append" type="primary" @click="verifyEmail()">点击验证邮箱</el-button>
          <i v-if="isVerifyEmail" slot ="append" class="el-icon-check"></i>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('common.signUp.password')" :label-width="formLabelWidth" prop="password" width="150px">
        <el-input :type="registerPassword" v-model.trim="authInfo.password" auto-complete="off">
          <el-button slot="append" :icon="passwordIcon" @click="changeType()"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('common.signUp.code')" :label-width="formLabelWidth" prop="code">
        <el-input v-model.trim="authInfo.code" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="cancelAll()">{{$t('common.signUp.registerCancel')}}</el-button> -->
      <el-button @click="cancelSignUp">回到登录</el-button>
      <el-button type="primary" @click="signUp()">{{$t('common.signUp.registerConfirm')}}</el-button>
    </div>
  </el-dialog>
</template>
<script>
const crypto = require('crypto')
export default {
  name: 'createForm',
  props: ['createShow', 'data'],
  data: function () {
    return {
      stuInfo: {},
      registerPassword: 'password',
      passwordIcon: 'fa fa-eye',
      formLabelWidth: '100px',
      isVerifyEmail: false,
      verifiedEmail: '',
      validCode: '',
      authInfo: {
        // username: '',
        password: '',
        stuId: '',
        realName: '',
        email: ''
      },
      authRules: {
        stuId: [
          { required: true, message: this.$t('message.signUp.inputStuId'), trigger: 'blur' },
          {
            pattern: /^[0-9]{4,16}$/,
            message: this.$t('message.signUp.invalidStuId'),
            trigger: 'blur'
          }
        ],
        realName: [
          { required: true, message: this.$t('message.signUp.inputStuId'), trigger: 'blur' }
        ],
        code: [
          { required: true, message: this.$t('message.signUp.inputCode'), trigger: 'blur' }
        ],
        /*
        username: [
          { required: true, message: this.$t('message.signUp.inputName'), trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_.]{4,16}$/,
            message: this.$t('message.signUp.invalidName'),
            trigger: 'blur'
          }
        ],
        */
        password: [
          { required: true, message: this.$t('message.signUp.inputPassword'), trigger: 'blur' },
          { min: 6, message: this.$t('message.signUp.minPassword'), trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('message.personal.phEmail'), trigger: 'blur' },
          {
            pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            message: this.$t('message.personal.mailForm'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async signUp () {
      // console.log(this.authInfo)
      let isSignUp = await this.checkInput()
      if (isSignUp === true) {
        return false
      }
      if (this.isVerifyEmail === false) {
        this.$message({
          type: 'error',
          message: '邮箱未验证'
        })
        return false
      } else if (this.authInfo.code !== this.validCode) {
        this.$message({
          type: 'error',
          message: '验证码错误'
        })
        return false
      }
      // 若不存在，登录注册信息
      let id = await this.createAuthInfo()
      await this.createStuInfo(id.insertId)
      this.$message({
        type: 'success',
        message: '帐号生成成功，请登录'
      })
      this.$router.push('/login')
    },
    createAuthInfo () {
      return new Promise((resolve, reject) => {
        let data = {
          _csrf: this.$cookies.get('csrfToken'),
          data: {
            password: this.authInfo.password,
            realName: this.authInfo.realName,
            email: this.verifiedEmail
          }
        }
        let sha1 = crypto.createHash('sha1')
        sha1.update(data.data.password)
        data.data.password = sha1.digest('hex')
        this.$api.post('authentications', data, res => {
          resolve(res)
        }, res => {
          reject(new Error('auth注册失败'))
        })
      })
    },
    createStuInfo (id) {
      return new Promise((resolve, reject) => {
        this.stuInfo.id = id
        let data = {
          _csrf: this.$cookies.get('csrfToken'),
          data: {
            'id': id,
            'stuId': this.authInfo.stuId,
            'realName': this.authInfo.realName
          }
        }
        this.$api.post('stuInfos', data, res => {
          resolve(res)
        }, res => {
          reject(new Error('stuInfo注册失败'))
        })
      })
    },
    checkInput () {
      return new Promise((resolve, reject) => {
        this.$refs['authInfo'].validate(async (valid) => {
          if (valid) {
            // console.log(this.authInfo)
            // 检查帐号是否存在
            if (await this.checkEmail()) {
              this.$message({
                type: 'warning',
                message: this.authInfo.email + '已注册，若不是本人，请及时联系管理员'
              })
              resolve(true)
            /* } else if (await this.checkIdNumber()) {
              this.$message({
                type: 'warning',
                message: '学号:' + this.authInfo.stuId + '，已注册，若不是本人，请及时联系管理员'
              })
              resolve(true) */
            } else {
              resolve(false)
            }
          }
        })
      })
    },
    // 检查 auth 表中的 email 是否重复
    checkEmail () {
      return new Promise((resolve, reject) => {
        let data = { 'email': this.authInfo.email }
        this.$api.get('authentications', data, res => {
          resolve(true)
        },
        res => {
          if (res.status === 404) {
            resolve(false)
          } else {
            reject(new Error('服务器错误'))
          }
        })
      })
    },
    // 检查 stuInof 表中的 idNumber 是否重复
    checkIdNumber () {
      return new Promise((resolve, reject) => {
        // 检查帐号是否存在
        let data = { 'stuId': this.authInfo.stuId }
        this.$api.get('stuInfos', data, res => {
          resolve(true)
        },
        res => {
          if (res.status === 404) {
            resolve(false)
          } else {
            reject(new Error('服务器错误'))
          }
        })
      })
    },
    async verifyEmail () {
      let reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      if (reg.test(this.authInfo.email)) {
        if (await this.checkEmail()) {
          this.$message({
            type: 'warning',
            message: this.authInfo.email + '已注册'
          })
          return false
        }
        await this.sendEmail()
        this.isVerifyEmail = true
        this.verifiedEmail = this.authInfo.email
      } else {
        this.$message({
          type: 'warning',
          message: this.authInfo.email + '不是正确的邮箱格式'
        })
      }
    },
    async sendEmail () {
      return new Promise((resolve, reject) => {
        // let id = ''
        let data = {
          _csrf: this.$cookies.get('csrfToken'),
          // 此处需要注意的是 text和html均为邮件内容，
          // 当html不为空时，text自动失效
          data: {
            indexStr: this.authInfo.email,
            explainStr: 'signUp',
            periodMinutes: 2880
          }
        }
        this.$api.post('validStrs', data, res => {
          // id = res.id
          this.validCode = res.validStr
          data = {
            _csrf: this.$cookies.get('csrfToken'),
            // 此处需要注意的是 text和html均为邮件内容，
            // 当html不为空时，text自动失效
            data: {
              email: this.authInfo.email,
              subject: 'Varification code for XJTLU OJ System',
              text: 'this is the pure text',
              html: 'Here is varification code<p href="color:red">' + res.validStr + '</p>'
            }
          }
          this.$api.post('emails', data, res => {
            this.$message({
              type: 'success',
              message: '邮件已发送'
            })
            // return validData
          }, res => {
            // reject(new Error('邮件发送失败'))
            this.$message({
              type: 'warning',
              message: '邮件发送失败'
            })
            // console.log('邮件发送失败')
          })
          // console.log(this.validCode)
          resolve(true)
        }, async res => {
          if (res.status === 500) {
            reject(new Error('数据库错误'))
            // console.log('数据库错误')
          } else if (res.status === 403) {
            // reject(new Error('验证码已存在'))
            // console.log('验证码已存在')
            await this.validator(res.data.detail.id)
          } else {
            // console.log('验证码发送错误')
            reject(new Error('验证码发送错误'))
          }
        })
      })
    },
    validator (id) {
      return new Promise((resolve, reject) => {
        this.$api.get('validStrs/' + id, null, res => {
          this.validCode = res
          this.$message({
            type: 'warning',
            message: '邮件之前已发送'
          })
          this.isVerifyEmail = true
          resolve(true)
        }, res => {
          reject(new Error('服务器错误'))
        })
      })
    },
    cancelSignUp () {
      this.$router.push('/login')
    },
    changeType () {
      if (this.registerPassword === 'password') {
        this.registerPassword = 'text'
        this.passwordIcon = 'fa fa-eye-slash'
      } else {
        this.registerPassword = 'password'
        this.passwordIcon = 'fa fa-eye'
      }
    },
    parseTinyInt (data) {
      return data === '是' ? 1 : 0
    },
    sexToTinyInt (sex) {
      return sex === '男' ? 1 : 0
    },
    getDepartmentId (departmentName) {
      let data = {
        departmentName: departmentName
      }
      return new Promise((resolve, reject) => {
        this.$api.get('departments', data, res => {
          resolve(res[0].id)
        }, res => {
          reject(new Error('获取系部信息出错'))
        })
      })
    },
    getClassId (className) {
      let data = {
        className: className
      }
      // console.log(data)
      return new Promise((resolve, reject) => {
        this.$api.get('classInfos', data, res => {
          resolve(res[0].id)
        }, res => {
          reject(new Error('获取班级信息出错'))
        })
      })
    },
    getSpecId (specName) {
      let data = {
        specName: specName
      }
      // console.log(data)
      return new Promise((resolve, reject) => {
        this.$api.get('specialities', data, res => {
          resolve(res[0].id)
        }, res => {
          reject(new Error('获取专业信息出错'))
        })
      })
    }
  },
  /*
  watch: {
    // chkInfoShow 与 chkInfoVisible 父子组件联动
    createShow: async function () {
      this.stuInfo.idNumber = this.data.证件号码
      this.stuInfo.stuId = this.data.学号
      this.stuInfo.realName = this.data.姓名
      this.stuInfo.sex = this.sexToTinyInt(this.data.性别)
      this.stuInfo.grade = this.data.所在年级
      this.stuInfo.departmentId = await this.getDepartmentId(this.data.所在学部)
      this.stuInfo.specialityId = await this.getSpecId(this.data.所在专业)
      this.stuInfo.classId = await this.getClassId(this.data.所在班级)
      this.stuInfo.isInSchoolRoll = this.parseTinyInt(this.data.是否在籍)
      this.stuInfo.isStuding = this.parseTinyInt(this.data.是否在校)
      this.stuInfo.isStay = this.parseTinyInt(this.data.是否住宿)
      this.stuInfo.isInternship = this.parseTinyInt(this.data.是否下厂实习)
      this.stuInfo.eduBack = this.data.入学层次
      // console.log(this.stuInfo)
    },
    data: function () {
    }
  },
  */
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

  .el-input {
    width: 80%;
  }
</style>
