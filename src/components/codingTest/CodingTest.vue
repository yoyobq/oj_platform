<template>
    <div class="code-area">
      <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingQuestion.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('common.codingTest.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <el-row>
      <el-col class="leftPart">
        <vtitle :topic="topic" :describe="describe" :hint="hint"></vtitle>
        <testcase :cqId="cqId"></testcase>
      </el-col>
      <el-col class="middlePart">
        <vcode :editorOption="editorOption" :preCode="preCode" ref="myCode"></vcode>
        <!--<el-button @click="cancel">Cancel</el-button>-->
        <el-button type="primary" @click="run">Submit and Run</el-button>
        <el-button type="success" @click="save">Save Code</el-button>
      </el-col>
      <el-col class="rightPart">
        <info :submitCount="submitCount" :timeLimit="timeLimit" :memLimit="memLimit" :minTime="minTime" :minMem="minMem" :startDate="startDate"></info>
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
      cqId: '',
      topic: '',
      describe: '',
      hint: '',
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
      crId: '',
      submitCount: 0,
      timeLimit: null,
      memLimit: null,
      realTime: null,
      realMem: null,
      startDate: '',
      errMsg: '',
      correctRate: '',
      minTime: 0,
      minMem: 0
    }
  },
  methods: {
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
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
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
        this.errMsg = res.data.error
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
          status: 'done'
        }
      }
      this.$api.put('codingRecords/' + this.crId, data, res => {}, res => {})
    }
  },
  computed: {
  },
  watch: {
  },
  mounted () {
    // console.log('this is current editor object', this.editor)
  },
  created () {
    this.cqId = this.$route.query.id
    this.$api.get('codingQuestions/' + this.cqId, null, res => {
      this.topic = res.topic
      this.describe = res.describe
      this.hint = res.hint
      this.preCode = res.preCode
      if (res.timeLimit === 0) {
        this.timeLimit = this.$t('common.codingTest.unLimited')
      } else {
        this.timeLimit = res.timeLimit + 'ms'
      }
      if (res.memLimit === 0) {
        this.memLimit = this.$t('common.codingTest.unLimited')
      } else {
        this.memLimit = res.memLimit + 'kb'
      }
    }, res => {})
    const startDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let data = {
      '_csrf': this.$cookies.get('csrfToken'),
      'data': {
        uId: sessionStorage.getItem('id'),
        cqId: this.cqId,
        startDate
      }
    }
    this.$api.post('codingRecords', data, res => {
      this.crId = res
      this.startDate = new Date(startDate).toLocaleString()
    }, res => {
      let data = {
        uId: sessionStorage.getItem('id'),
        cqId: this.cqId
      }
      this.$api.get('codingRecords', data, res => {
        let index = ''
        for (let i in res) {
          if (res[i].status === 'unsolved') {
            this.crId = res[i].id
            this.startDate = new Date(res[i].startDate).toLocaleString()
            if (res[i].code !== null) {
              this.preCode = res[i].code
            }
            break
          } else if (res[i].status === 'done') {
            index = i
          }
        }
        if (this.crId === '') {
          this.$confirm(this.$t('message.codingTest.addNewRecord'), this.$t('message.codingTest.message'), {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'data': {
                status: 'ignore'
              }
            }
            // console.log(this.editor.doc.getValue())
            // console.log(data)
            this.$api.put('codingRecords/' + res[index].id, data, res => {
            }, res => {
            })
            const startDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'data': {
                uId: sessionStorage.getItem('id'),
                cqId: this.cqId,
                startDate
              }
            }
            this.$api.post('codingRecords', data, res => {
              this.crId = res
              this.startDate = new Date(startDate).toLocaleString()
            }, res => {})
          }).catch(() => {
            this.$router.go(-1)
          })
        }
      }, res => {})
    })
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