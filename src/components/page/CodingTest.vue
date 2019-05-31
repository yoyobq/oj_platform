<template>
    <div class="code-area">
      <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingQuestion.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('common.codingTest.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div class="topic" >{{topic}}</div>
      <div class="describe" >{{describe}}</div>
      <div class="hint" >{{hint}}</div>
        <codemirror :value="preCode"
                    :options="editorOption"
                    ref="myEditor">
                    <!-- @change="yourCodeChangeMethod"> -->
        ></codemirror>
      <el-button type="primary" @click="saveAndRun">Save & Run</el-button>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
require('codemirror/mode/javascript/javascript')
// require('codemirror/mode/vue/vue')
require('codemirror/addon/hint/show-hint.js') // 提供autocomple的完整框架
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')
export default {
  componets: {
    codemirror
  },
  name: 'codeMirrorTest',
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
      crId: ''
    }
  },
  methods: {
    async saveAndRun () {
      await this.saveCodingRecord()
      await this.createFile()
    },
    saveCodingRecord () {
      return new Promise((resolve, reject) => {
        const solveDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          'data': {
            code: this.editor.doc.getValue(),
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
    }
  },
  computed: {
    editor () {
      // 获得现有的 editor 对象
      return this.$refs.myEditor.editor
    }
  },
  mounted () {
    this.editor.focus()
    // console.log('this is current editor object', this.editor)
  },
  created () {
    this.cqId = this.$route.query.id
    this.$api.get('codingQuestions/' + this.cqId, null, res => {
      this.topic = res.topic
      this.describe = res.describe
      this.hint = res.hint
      this.preCode = res.preCode
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
    }, res => {
      let data = {
        uId: sessionStorage.getItem('id'),
        cqId: this.cqId
      }
      this.$api.get('codingRecords', data, res => {
        this.crId = res[0].id
        if (res[0].code !== null) {
          this.preCode = res[0].code
        }
      }, res => {})
    })
  }
}
</script>
<style scoped>
  .code-area{
    position: relative;
    left: 100px;
    top: 20px;
  }
</style>