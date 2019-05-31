<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i>{{$t('common.personal.title')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
          <!--<el-alert v-if="isGuest" :title="$t('message.personal.guestInfo')" type="error"></el-alert>
          <el-alert v-if="permission.status === 'Teacher' && permission.module === undefined" :title="$t('message.personal.teacherInfo')" type="error"></el-alert>-->

          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="200px" size="medium" >
            <!-- <el-form-item :label="$t('common.personal.myPermission')" prop="type">
              <el-radio-group v-if="isGuest === false" v-model="ruleForm.type">
                <el-radio-button label="Assitant" name="type" value="Assitant" border>{{$t('common.personal.assitant')}}</el-radio-button>
                <el-radio-button label="Teacher" name="type" value="Teacher" border>{{$t('common.personal.teacher')}}</el-radio-button>
                <el-radio-button v-if="ruleForm.type === 'Admin'" label="Admin" name="type" value="Admin" border>{{$t('common.personal.admin')}}</el-radio-button>
                <el-radio-button label="Guest" name="type" value="Guest" border>访客</el-radio-button>
              </el-radio-group>
              <div v-else>{{ permission.status }}</div>
            </el-form-item> -->
            <el-form-item :label="$t('common.personal.stuId')" prop="stuId">
              <div>{{ ruleForm.stuId }}</div>
            </el-form-item>
            <el-form-item :label="$t('common.personal.name')" prop="realName">
              <div>{{ ruleForm.realName }}</div>
            </el-form-item>
            <el-form-item v-if="ruleForm.type !== 'Teacher'" :label="$t('common.personal.degree')" prop="highestDegree">
              <!-- undergraduate, Master Student, PhD Student -->
              <el-select v-model="ruleForm.highestDegree" :placeholder="$t('message.personal.phDegree')">
                <el-option :label="$t('common.personal.senior')" value="高中生">{{ $t('common.personal.senior') }}</el-option>
                <el-option :label="$t('common.personal.undergrauate')" value="本科生">{{ $t('common.personal.undergrauate') }}</el-option>
                <el-option :label="$t('common.personal.masterStudent')" value="研究生">{{ $t('common.personal.masterStudent') }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.personal.department')" prop="departmentName">
              <el-select v-model="ruleForm.departmentName" :placeholder="$t('message.personal.phDepartment')">
                <el-option label="CSSE" value="CSSE">CSSE</el-option>
                <el-option label="EEE" value="EEE">EEE</el-option>
                <el-option :label="$t('common.personal.other')" value="other">{{$t('common.personal.other')}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.personal.school')" prop="school">
              <el-autocomplete 
                v-model="ruleForm.school" 
                :placeholder="$t('message.personal.phSchool')"
                :fetch-suggestions="schoolSearch"
                disabled
              ></el-autocomplete>
            </el-form-item>
            <el-form-item :label="$t('common.personal.eMail')" prop="email">
              <div>{{ruleForm.email}}</div>
            </el-form-item>
            <!--<el-form-item :label="$t('common.personal.phone')" prop="cellphone">
              <el-input v-model="ruleForm.cellphone" :placeholder="$t('message.personal.phCellPhone')"></el-input>
            </el-form-item>-->
            <el-form-item>
              <el-button @click="resetForm('ruleForm')" type="warning">{{$t('common.personal.reset')}}</el-button>
              <el-button v-if="isGuest" type="primary" @click="submitForm()">{{$t('common.personal.submit')}}</el-button>
              <template v-else>
                <el-button @click="submitForm()">{{$t('common.personal.save')}}</el-button>
                <el-button type="primary" @click="changePass()">{{$t('common.personal.changePass')}}</el-button>
              </template>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
const crypto = require('crypto')
export default {
  name: 'basetable',
  data () {
    return {
      id: sessionStorage.getItem('id'),
      email: localStorage.getItem('email'),
      validCode: '',
      // permission: JSON.parse(sessionStorage.getItem('permission')),
      permission: sessionStorage.getItem('permission'),
      isGuest: false,
      ruleForm: {
        stuId: '',
        realName: '',
        highestDegree: '',
        departmentName: '',
        type: '',
        school: '西交利物浦',
        email: '',
        cellphone: ''
      },
      rules: {
        stuId: [
          { required: false, message: this.$t('message.personal.inputName'), trigger: 'blur' },
          { min: 2, max: 50, message: this.$t('message.personal.nameLength'), trigger: 'blur' }
        ],
        realName: [
          { required: false, message: this.$t('message.personal.inputName'), trigger: 'blur' },
          { min: 2, max: 50, message: this.$t('message.personal.nameLength'), trigger: 'blur' }
        ],
        highestDegree: [
          { required: false, message: this.$t('message.personal.phDegree'), trigger: 'change' }
        ],
        departmentName: [
          { required: false, message: this.$t('message.personal.phDepartment'), trigger: 'change' }
        ],
        school: [
          { required: false, message: this.$t('message.personal.phSchool'), trigger: 'change' }
        ],
        type: [
          { required: false, message: this.$t('message.personal.phType'), trigger: 'change' }
        ],
        email: [
          { required: false, message: this.$t('message.personal.phEmail'), trigger: 'blur' },
          {
            pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
            message: this.$t('message.personal.mailForm'),
            trigger: 'blur'
          }
        ],
        cellphone: [
          { required: true, message: this.$t('message.personal.phCellPhone'), trigger: 'blur' },
          {
            pattern: /^[\d-]+$/,
            message: this.$t('message.personal.phoneForm'),
            trigger: 'blur'
          }
        ]
      },
      departments: []
    }
  },
  async created () {
    this.ruleForm.stuId = localStorage.getItem('stuId')
    this.ruleForm.realName = localStorage.getItem('realName')
    this.ruleForm.email = localStorage.getItem('email')
    this.ruleForm.highestDegree = localStorage.getItem('eduBack')
    this.ruleForm.departmentName = localStorage.getItem('departmentName')
    // this.ruleForm.cellphone = localStorage.getItem('cellphone')
  },
  computed: {
  },
  methods: {
    getPersonalData () {
      this.$api.get('stuFullInfos/' + this.id, null, res => {
        // this.ruleForm.realName = localStorage.getItem('pf_realName')
        this.ruleForm.cellphone = res.cellphone
        this.ruleForm.department = res.department
        this.ruleForm.email = res.email
        this.ruleForm.highestDegree = res.highestDegree
        this.ruleForm.school = res.school
      }, res => {
        // 找不到符合条件的用户账户
        // console.log(res)
        this.$message.error(this.$t('message.loginPage.notFound'))
      })
    },
    changePass () {
      this.$confirm(this.$t('message.personal.verifyEmail'), '提示', {
        confirmButtonText: '发送',
        cancelButtonText: '取消',
        closeOnClickModal: false
      }).then(() => {
        this.sendEmail()
        // let reg = new RegExp('\\b' + this.validCode + '\\b')
        this.$prompt(this.$t('message.personal.inputCode'), this.$t('common.module.tips'), {
          confirmButtonText: this.$t('common.module.confirm'),
          cancelButtonText: this.$t('common.module.cancel'),
          closeOnClickModal: false,
          inputPattern: /\w+/,
          inputErrorMessage: '请输入验证码'
        }).then(({ value }) => {
          if (value === this.validCode) {
            this.$prompt(this.$t('message.personal.inputNewPasswd'), this.$t('common.module.tips'), {
              confirmButtonText: this.$t('common.module.confirm'),
              cancelButtonText: this.$t('common.module.cancel'),
              closeOnClickModal: false,
              inputType: 'password',
              inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+/,
              inputErrorMessage: '请输入新密码'
            }).then(({ value }) => {
              let sha1 = crypto.createHash('sha1')
              sha1.update(value)
              value = sha1.digest('hex')
              let data = {
                '_csrf': this.$cookies.get('csrfToken'),
                'data': {
                  id: this.id,
                  password: value
                }
              }
              this.$api.put('authentications/' + this.id, data, res => {
                this.$message({
                  type: 'success',
                  message: this.$t('message.personal.changePassSucceed')
                })
                sessionStorage.clear()
                localStorage.clear()
                this.$router.push('/login')
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '修改取消'
              })
            })
          } else {
            this.$message({
              type: 'warning',
              message: '验证码错误'
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消验证'
        })
      })
    },
    async sendEmail () {
      return new Promise((resolve, reject) => {
        // let id = ''
        let data = {
          _csrf: this.$cookies.get('csrfToken'),
          // 此处需要注意的是 text和html均为邮件内容，
          // 当html不为空时，text自动失效
          data: {
            indexStr: this.email,
            explainStr: 'modifyPassword',
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
              email: this.email,
              subject: 'Varification code for XJTLU OJ System',
              text: 'this is the pure text',
              html: 'Here is varification code<p href="color:red">' + res.validStr + '</p>'
            }
          }
          this.$api.post('emails', data, res => {
            // console.log('邮件发送成功')
            this.$message({
              type: 'success',
              message: '邮件发送成功'
            })
          }, res => {
            // reject(new Error('邮件发送失败'))
            // console.log('邮件发送失败')
            this.$message({
              type: 'warning',
              message: '邮件发送失败'
            })
          })
          // console.log(this.validCode)
          resolve(true)
        }, async res => {
          if (res.status === 500) {
            reject(new Error('数据库错误'))
            // console.log('数据库错误')
          } else if (res.status === 403) {
            // reject(new Error('验证码已存在'))
            console.log('验证码已存在')
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
          // console.log(res)
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
    departmentSearch (queryString, cb) {
      var departments = this.departments
      var results = queryString ? departments.filter(this.createFilter(queryString)) : departments
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    schoolSearch (queryString, cb) {
      var schools = this.schools
      var results = queryString ? schools.filter(this.createFilter(queryString)) : schools
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (departments) => {
        return (departments.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.submitInfo()
        }
      })
    },
    async submitInfo () {
      let departmentId = await this.getDepartmentId()
      let data = {
        _csrf: this.$cookies.get('csrfToken'),
        // 'realName': this.ruleForm.realName,
        data: {
          'id': this.id,
          'departmentId': departmentId,
          // 'school': this.ruleForm.school,
          'eduBack': this.ruleForm.highestDegree
          // 'email': this.ruleForm.email,
          // 'cellphone': this.ruleForm.cellphone
        }
      }
      // console.log(data)
      this.$api.put('stuInfos/' + this.id, data, res => {
        this.setLocalStorage()
        this.$message({
          type: 'success',
          message: '个人信息修改成功！'
        })
      }, res => {
        this.$message({
          type: 'error',
          message: this.$t('message.personal.serverError')
        })
      })
    },
    setLocalStorage (stuInfo, authInfo) {
      // localStorage.setItem('realName', this.ruleForm.realName)
      // localStorage.setItem('stuId', this.ruleForm.stuId)
      localStorage.setItem('departmentName', this.ruleForm.departmentName)
      localStorage.setItem('eduBack', this.ruleForm.highestDegree)
      // localStorage.setItem('email', this.ruleForm.email)
    },
    getDepartmentId () {
      return new Promise((resolve, reject) => {
        if (!this.ruleForm.departmentName) {
          resolve(null)
        } else {
          let data = {
            'departmentName': this.ruleForm.departmentName
          }
          this.$api.get('departments', data, res => {
            resolve(res[0].id)
          }, res => {
            reject(new Error('获取系部信息出错'))
          })
        }
      })
    },
    async editName () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'realName': this.ruleForm.realName,
        'type': this.ruleForm.type
      }
      // console.log(data)
      this.$api.put('api/v1/accounts/' + this.id, data, res => {})
    },
    editInfo () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'realName': this.ruleForm.realName,
        'department': this.ruleForm.department,
        'school': this.ruleForm.school,
        'highestDegree': this.ruleForm.highestDegree,
        'email': this.ruleForm.email,
        'cellphone': this.ruleForm.cellphone
      }
      // console.log(data)
      this.$api.put('api/v1/informations/' + this.id, data, res => {}, res => {
        this.$message({
          type: 'error',
          message: this.$t('message.personal.serverError')
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.departments = [{'value': 'CSSE'}, {'value': 'EEE'}]
    this.schools = [{'value': '西交利物浦'}]
  }
}
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }

    .el-input, .el-autocomplete{
      width: 500px;
      min-width: 300px;
    }

    .el-form {
      padding-top: 0px;
    }

    .container {
      min-width: 650px;
      width: 700px;
    }
</style>
