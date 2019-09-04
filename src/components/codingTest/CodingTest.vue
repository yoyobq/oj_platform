<template>
    <div class="code-area">
      <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingQuestion.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('common.codingTest.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <el-row class="test-el-row">
      <el-col class="leftPart">
        <vtitle :topic="question.topic" :describe="question.describe" :hint="question.hint"></vtitle>
        <testcase :cqId="cqId"></testcase>
      </el-col>
      <el-col class="middlePart">
        <vcode :editorOption="editorOption" :preCode="question.preCode" :programLang="programLang" ref="myCode"></vcode>
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="run">{{$t('common.codingTest.sub&run')}}</el-button>
        <el-button type="success" @click="save">{{$t('common.codingTest.save')}}</el-button>
      </el-col>
      <el-col class="rightPart">
        <info :submitCount="submitCount" :timeLimit="question.timeLimit" :memLimit="question.memLimit" :minTime="record.minTime" :minMem="record.minMem" :startDate="record.startDate"></info>
        <error :errMsg="errMsg"></error>
        <result :correctRate="correctRate" :realTime="realTime" :realMem="realMem"></result>
      </el-col>
      </el-row>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
/* import code from './components/Code'
import error from './components/Error'
import info from './components/Info'
import result from './components/Result'
import testcase from './components/TestCase'
import vtitle from './components/Title' */
require('codemirror/mode/javascript/javascript')
// require('codemirror/mode/vue/vue')
require('codemirror/addon/hint/show-hint.js') // 提供autocomple的完整框架
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')

export default {
  name: 'codingTest',
  components: {
    codemirror,
    'vcode': resolve => { require(['./components/Code.vue'], resolve) },
    'error': resolve => { require(['./components/Error.vue'], resolve) },
    'info': resolve => { require(['./components/Info.vue'], resolve) },
    'result': resolve => { require(['./components/Result.vue'], resolve) },
    'testcase': resolve => { require(['./components/TestCase.vue'], resolve) },
    'vtitle': resolve => { require(['./components/Title.vue'], resolve) }
  },
  data () {
    return {
      uId: sessionStorage.getItem('id'),
      cqId: 0,
      crId: '',
      question: {},
      record: {},
      editorOption: {
        // value 可以是字符串，也可以是文档对象，
        // 实际编码的时候可以试试文档对象，简化文件操作,
        // value: 'console.log("hihihi")', 好像无效？是因为vue的问题吗？
        mode: 'javascript',
        linueSeparator: null, // 换行符，默认就是null，能自动处理CRLF，拆分CR和LF，将LF作为换行分隔符
        lineNumbers: true, // 是否显示行号
        autohint: true,
        // readOnly: true, // 只读，试试 'nocursor'
        // workTime: 很有意思的两个参数，详见codeMirror的文档
        // workDelay: 仅记录用，暂不启用

        // ctrl + . 触发代码自动补齐，不用 ctrl + space是因为与中文操作系统切换输入法冲突
        extraKeys: {'Ctrl-.': 'autocomplete'}
      },
      preCode: '',
      submitCount: 0,
      timeLimit: null,
      memLimit: null,
      realTime: null,
      realMem: null,
      startDate: '',
      errMsg: '',
      correctRate: '',
      minTime: 0,
      minMem: 0,
      programLang: 'Javascript'
    }
  },
  created () {
    // this.cqId = this.$route.query.id
    // this.$api.get('codingQuestions/' + this.cqId, null, res => {
    //   console.log(res)
    //   this.topic = res.topic
    //   this.describe = res.describe
    //   this.hint = res.hint
    //   this.preCode = res.preCode
    //   if (res.timeLimit === 0) {
    //     this.timeLimit = this.$t('common.codingTest.unLimited')
    //   } else {
    //     this.timeLimit = res.timeLimit + 'ms'
    //   }
    //   if (res.memLimit === 0) {
    //     this.memLimit = this.$t('common.codingTest.unLimited')
    //   } else {
    //     this.memLimit = res.memLimit + 'kb'
    //   }
    // }, res => {})
    // const startDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    // let data = {
    //   '_csrf': this.$cookies.get('csrfToken'),
    //   'data': {
    //     uId: sessionStorage.getItem('id'),
    //     cqId: this.cqId,
    //     startDate
    //   }
    // }
    // this.$api.post('codingRecords', data, res => {
    //   this.crId = res
    //   this.startDate = new Date(startDate).toLocaleString()
    // }, res => {
    //   let data = {
    //     uId: sessionStorage.getItem('id'),
    //     cqId: this.cqId
    //   }
    //   this.$api.get('codingRecords', data, res => {
    //     let index = ''
    //     for (let i in res) {
    //       if (res[i].status === 'unsolved') {
    //         this.crId = res[i].id
    //         this.startDate = new Date(res[i].startDate).toLocaleString()
    //         if (res[i].code !== null) {
    //           this.preCode = res[i].code
    //         }
    //         break
    //       } else if (res[i].status === 'done') {
    //         index = i
    //       }
    //     }
    //     if (this.crId === '') {
    //       this.$confirm(this.$t('message.codingTest.addNewRecord'), this.$t('message.codingTest.message'), {
    //         confirmButtonText: this.$t('common.codingTest.ok'),
    //         cancelButtonText: this.$t('common.codingTest.cancel')
    //       }).then(() => {
    //         let data = {
    //           '_csrf': this.$cookies.get('csrfToken'),
    //           'data': {
    //             status: 'ignore'
    //           }
    //         }
    //         // console.log(this.editor.doc.getValue())
    //         // console.log(data)
    //         this.$api.put('codingRecords/' + res[index].id, data, res => {
    //         }, res => {
    //         })
    //         const startDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    //         data = {
    //           '_csrf': this.$cookies.get('csrfToken'),
    //           'data': {
    //             uId: sessionStorage.getItem('id'),
    //             cqId: this.cqId,
    //             startDate
    //           }
    //         }
    //         this.$api.post('codingRecords', data, res => {
    //           this.crId = res
    //           this.startDate = new Date(startDate).toLocaleString()
    //         }, res => {})
    //       }).catch(() => {
    //         this.$router.go(-1)
    //       })
    //     }
    //   }, res => {})
    // })
  },
  async mounted () {
    try {
      this.cqId = await this.getCqId()
      sessionStorage.setItem('cqId', this.cqId)
      this.question = await this.getQuestData()
      let records = await this.getQuestRecords()
      this.record = await this.filterRecord(records)
      console.log(this.question)
      console.log(this.record)
    } catch (error) {
      console.log(error)
      this.$router.go(-1)
    }
  },
  methods: {
    getCqId () {
      return new Promise((resolve, reject) => {
        let cqId = this.$route.params.id
        // 如果没有获得传递过来的 cqId，那么去sessionStorage中拿
        if (!cqId && sessionStorage.getItem('cqId')) {
          cqId = sessionStorage.getItem('cqId')
        }

        if (cqId) {
          resolve(cqId)
        } else {
          reject(new Error('can not get question id.'))
        }
      })
    },
    getQuestData () {
      return new Promise((resolve, reject) => {
        this.$api.get('codingQuestions/' + this.cqId, null, res => {
          resolve(res)
        }, res => {
          reject(new Error(res))
        })
      })
    },
    getQuestRecords () {
      return new Promise((resolve, reject) => {
        let data = {
          where: {
            cqId: this.cqId,
            uId: this.uId,
            status: ['unsolved', 'done', 'timeout']
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingRecords', data, res => {
          resolve(res)
        }, res => {
          console.log(res)
          reject(new Error(res))
        })
      })
    },
    filterRecord (records) {
      return new Promise(async (resolve, reject) => {
        if (records.length === 1) {
          this.record = records[0]
        } else {
          throw new Error('Record Error')
        }
        switch (records[0].status) {
          case 'unsolved':
            if (await this.isTimeOut(records[0])) {
              this.setQuestTimeout(records[0].id)
            } else {
              resolve(records[0])
            }
            break
          case 'done':
            this.startOverMsg('SOLVED')
            break
          case 'timeout':
            this.startOverMsg('TIMED OUT')
            break
          default:
            break
        }
      })
    },
    startOverMsg (msgStr) {
      this.$confirm('This question has ' + msgStr + ', do you want to start over?', msgStr, {
        confirmButtonText: 'ok',
        cancelButtonText: 'cancel',
        type: 'warning'
      })
        .then(() => {
          this.startOver(this.record.id)
          this.$message({
            type: 'success',
            message: 'success!'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled'
          })
          this.$router.go(-1)
        })
    },
    // 重做此题
    async startOver (qrId) {
      try {
        await this.closeTheRecord(qrId)
        await this.startNewRecord(qrId)
        this.$router.go(0)
      } catch (error) {
        console.log(error)
      }
    },
    setQuestTimeout (id) {
      // console.log(id)
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          status: 'timeout'
        }
      }
      this.$api.put('codingRecords/' + id, data, res => {
        this.startOverMsg('TIMED OUT')
      }, res => {
        throw new Error(res)
      })
    },
    // 关闭原有做题记录
    closeTheRecord (qrId) {
      return new Promise((resolve, reject) => {
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          'data': {
            status: 'ignore'
          }
        }
        this.$api.put('codingRecords/' + qrId, data, res => {
          resolve()
        }, res => {
          throw new Error(res)
        })
      })
    },
    // 建立新的做题记录
    startNewRecord (qrId) {
      return new Promise((resolve, reject) => {
        // 这个操作不会经常发生，所以干脆做个数据安全的冗余检查（理论上不会出现这个问题）
        // 先检查是否存在未关闭的题目
        let data = {
          where: {
            cqId: this.cqId,
            uId: this.uId,
            status: ['unsolved', 'done', 'timeout']
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingRecords', data, res => {
          // 如果还存在未关闭的题目，抛出错误，停止新建
          throw new Error('已有多余记录，请联系管理员')
        }, res => {
          // 没有的话再建立一个新的做题记录
          const startDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          const expireTime = this.record.expireTime
          data = {
            '_csrf': this.$cookies.get('csrfToken'),
            'data': {
              uId: this.uId,
              cqId: this.cqId,
              startDate,
              expireTime
            }
          }
          this.$api.post('codingRecords', data, res => {
            resolve()
          }, res => {
            throw new Error('Create record fail')
          })
        })
      })
    },
    // 检查是否超时
    isTimeOut (record) {
      return new Promise((resolve, reject) => {
        let expireTime = record.expireTime
        // 如果未设定过期时间，就是无限期，不用计算
        if (!expireTime) {
          resolve(0)
        } else {
        // 如果有过期时间的设定，判断是否过期
          let nowDate = this.$moment(Date.now()).valueOf()
          let startDate = this.$moment(record.startDate).valueOf()
          // console.log(record.startDate + 20 * 1000 * 60)
          let passedTime = (nowDate - startDate) / 1000 / 60
          if (record.expireTime >= passedTime) {
            resolve(0)
          } else {
            resolve(1)
          }
        }
      })
    },
    async save () {
      await this.saveCodingRecord()
      await this.createFile()
    },
    async run () {
      await this.saveCodingRecord()
      await this.createFile()
      this.submitCount++
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          cqId: this.cqId,
          uId: sessionStorage.getItem('id')
        }
      }
      this.$api.post('judge', data, res => {
        let msg = JSON.parse(res.stdout)
        if (msg.errMsg !== undefined) {
          this.errMsg = msg.errMsg
          this.$message({
            type: 'error',
            message: this.$t('message.codingTest.testError')
          })
        } else {
          this.errMsg = null
          this.correctRate = msg.rightNum / msg.testcasesLength * 100 + '%'
          this.realTime = msg.totalTime
          if (this.minTime === null) {
            this.minTime = this.realTime
          } else if (this.minTime > this.realTime) {
            this.minTime = this.realTime
          }
          this.$alert(this.$t('message.codingTest.correctRate') + ': ' + msg.rightNum / msg.testcasesLength * 100 + '%\n' +
          this.$t('message.codingTest.time') + ': ' + msg.totalTime + 'ms', this.$t('message.codingTest.testResult'), {
            confirmButtonText: '确定',
            callback: action => {
              if (this.correctRate === '100%') {
                this.$confirm(this.$t('message.codingTest.statusDone'), this.$t('message.codingTest.message'), {
                  confirmButtonText: this.$t('common.codingTest.ok'),
                  cancelButtonText: this.$t('common.codingTest.cancel'),
                  type: 'warning'
                }).then(() => {
                  this.statusDone()
                  this.$router.push('codingQuestion')
                }).catch(() => {
                })
              }
            }
          })
        }
      }, res => {
        var reg1 = new RegExp('D:/oj_reserve/submitCode/', 'g')
        var reg2 = new RegExp(/D:\\oj_reserve\\submitCode\\/, 'g')
        var reg3 = new RegExp('/var/www/oj_reserve/submitCode/', 'g')
        res.data.error = res.data.error.replace(reg1, '').replace(reg2, '').replace(reg3, '')
        let index1 = res.data.error.indexOf('at')
        let index2 = res.data.error.indexOf('at', index1 + 1)
        this.errMsg = res.data.error.substring(0, index2)
        this.correctRate = ''
        this.realTime = null
        this.realMem = null
        this.$message({
          type: 'error',
          message: this.$t('message.codingTest.testError')
        })
      })
    },
    saveCodingRecord () {
      return new Promise((resolve, reject) => {
        const solveDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          'data': {
            code: this.$refs.myCode.editor.doc.getValue(),
            solveDate: solveDate
          }
        }
        // console.log(this.editor.doc.getValue())
        // console.log(data)
        this.$api.put('codingRecords/' + this.crId, data, res => {
          resolve(true)
        }, res => {
          resolve(false)
        })
      })
    },
    createFile () {
      return new Promise((resolve, reject) => {
        let data2 = {
          '_csrf': this.$cookies.get('csrfToken'),
          'data': {
            type: 'judge', // 文件类型是判题文件
            cqId: this.cqId, // cordingQuestions中的
            uId: sessionStorage.getItem('id') // 作题人，应该从登陆用户的session中获取，保证安全
          }
        }
        this.$api.post('createJsFile', data2, res => {
          this.$message({
            type: 'success',
            message: this.$t('message.codingTest.createFileSucceed')
          })
          resolve(true)
        }, res => {
          resolve(false)
        })
      })
    },
    cancel () {
      this.$router.push('/codingQuestion')
    },
    statusDone () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          status: 'done',
          memUsage: this.realMem,
          timeUsage: this.realTime
        }
      }
      this.$api.put('codingRecords/' + this.crId, data, res => {}, res => {})
    }
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style scoped>
  .code-area{
    left: 20px;
    top: 20px;
    height: 100%
  }
  .leftPart{
    width:25%;
    height: 100%;
    padding: 1%;
  }
  .middlePart{
    width:50%;
    height: 100%;
    padding: 1%;
  }
  .rightPart{
    width:25%;
    height: 100%;
    padding: 1%;
  }
  .el-row{
    height: 100%;
  }
  .el-button{
    margin:20px;
    float: right;
    margin-right: 20px;
  }
</style>