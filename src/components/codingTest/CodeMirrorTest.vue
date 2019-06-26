<template>
    <div class="code-area">
      <codemirror :value="code"
                  :options="editorOption"
                  ref="myEditor">
                  <!-- @change="yourCodeChangeMethod"> -->
      ></codemirror>
      <el-button type="primary" @click="submitAndRun">Submit & Run</el-button>
      <el-button type="success" @click="testCreateFile">createFile</el-button>
      <el-button type="success" @click="run">run</el-button>
      <br><br>
        <el-button type="success" @click="testFuncShow">测试show</el-button>
        <el-button type="success" @click="testFuncIndex">测试index</el-button>
        <el-button type="success" @click="testFuncCreate">测试create</el-button>
        <el-button type="success" @click="testFuncUpdate">测试update</el-button>
        <el-button type="warning" @click="testFuncDestroy">测试destroy</el-button>
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
      testInt: 'codingQuestions',
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
      code: 'console.log("hello world")'
    }
  },
  methods: {
    run () {
      // 查询某人做过的所有 codingQuestions
      let data = {
        uId: 2,
        status: ['unsolved', 'done']
      }
      data = JSON.stringify(data)
      this.$api.get('codingRecords', {params: data}, res => {
        let records = res
        // 投影cqId列组成数组
        let idArr = res.map(item => {
          return item.cqId
        })
        // 根据cqId列，查询codingQuestions里的内容
        data = {
          id: idArr
        }
        data = JSON.stringify(data)
        this.$api.get('codingQuestions', {params: data}, res => {
          let tableData = []
          let questions = res
          // 合并cqId 和 id 相同的对象
          records.forEach((ritem, rindex) => {
            for (let qindex in questions) {
              if (ritem.cqId === questions[qindex].id) {
                // 找到符合条件的数据后，合并这两个对象
                tableData.push(Object.assign(ritem, questions[qindex]))
                // 数据一一对应时，一旦找到合并了符合条件的数据，就可以在原数组里删除这条数据 减少下次循环次数
                questions.splice(questions.findIndex(item => item.id === questions[qindex].id), 1)
                // 数据一一对应时，无需继续本次循环
                break
              }
            }
          })
          console.log(tableData) // 这里改成赋值就行了
        }, res => {
          console.log(res.data)
        })
      }, res => {
        console.log(res.data)
      })
    },
    submitAndRun () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          code: this.editor.doc.getValue()
        }
      }
      // console.log(this.editor.doc.getValue())
      // console.log(data)
      this.$api.post('codeTest', data, res => {
        console.log(res)
      }, res => {
        console.log(res.data)
      })
    },
    testCreateFile () {
      let inputText1 = '[ 2, 3, "a"]'
      let inputText2 = '[ 1, 2, 3]'
      let fromWeb = [
        JSON.parse(inputText1),
        JSON.parse(inputText2)
      ]
      let inputData = fromWeb
      console.log(inputData)
      // let inputData = JSON.stringify(
      //   [
      //     [ 2, 3, 5 ],
      //     [ 1, 2, 3 ]
      //   ])
      // let outputData = JSON.stringify([ 10, 6 ])
      // let data = {
      //   '_csrf': this.$cookies.get('csrfToken'),
      //   'data': {
      //     cqId: 5,
      //     inputData, // JSON字符串入库，切勿直接存JSON对象
      //     outputData // JSON字符串入库，切勿直接存JSON对象
      //   }
      // }
      // this.$api.post('testcases', data, res => {
      //   console.log(res)
      // }, res => {
      //   console.log(res.data)
      // })
    },
    testFuncShow () {
      console.log('in test Show')
      // this.$api.get(this.testInt + '/' + 1, null, res => {
      let data = {
        status: 'unsolve'
      }
      this.$api.get('codingRecords/count', data, res => {
        console.log(res)
      }, res => {
        console.log(res.data)
      })
    },
    testFuncIndex () {
      // console.log('in test index')
      let data = {
        // uId: 1,
        // programLang: 'js',
        status: 'edit'
      }
      let limit = 2
      let offset = 2
      console.log('in test index')
      this.$api.get(this.testInt, data, res => {
        console.log(res)
      }, res => {
        console.log(res.data)
      })
      console.log('in test index, with limit & offset')
      this.$api.get(this.testInt + '?limit=' + limit + '&offset=' + offset, data, res => {
        console.log(res)
      }, res => {
        console.log(res.data)
      })
    },
    testFuncCreate () {
      console.log('in test create')
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          uId: 1,
          programLang: 'js',
          inputDataStructure: 'string',
          outputDataStructure: 'string',
          testCode: `let rightNum = 0
try {
  for ( let count = 0; count < testCases.length; count++) {
    let result = code(testCases[count][0])
    let answer = testCases[count][1]

    if (result === answer) {
      rightNum++
    }
  }
} catch(error) {
  throw(error)
}

let correctRate = rightNum / testCases.length * 100
correctRate = correctRate.toFixed(2)
console.log(correctRate + '%')
`
        }
      }
      this.$api.post(this.testInt, data, res => {
        console.log(res)
      }, res => {
        console.log(res.data)
      })
    },
    testFuncUpdate () {
      console.log('in test update')
      // const solveDate = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          status: 'done'
        }
      }
      this.$api.put(this.testInt + '/' + 1, data, res => {
        console.log(res)
      }, res => {
        console.log(res.data)
      })
    },
    testFuncDestroy () {
      console.log('in test Destroy')
      let data = {
        '_csrf': this.$cookies.get('csrfToken')
      }
      this.$api.delete(this.testInt + '/' + 2, data, res => {
        console.log(res)
      }, res => {
        console.log(res)
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