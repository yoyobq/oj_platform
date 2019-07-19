<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createdQuestions.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('common.addTest.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <!-- 对应 question的 信息 和添加说明 -->
      <el-form :model="question" :rules="rules" ref="test" label-width="100px" size="medium" >
        <el-form-item label="Question No.">
          <div>{{question.id}}</div>
        </el-form-item>
        <el-form-item :label="$t('common.addTest.topic')">
          <div>{{question.topic}}</div>
        </el-form-item>
        <el-form-item label="Initial Code">
          <codemirror :value="question.preCode"
                  :mode="question.mode"
                  :options="editorOption"
                  ref="myEditor"
                  id="initCode">
                  <!-- @change="yourCodeChangeMethod"> -->
          ></codemirror>
        </el-form-item>
        <el-form-item label="instruction">
           <div sytle="margin-left: 100px;">请根据初始代码（函数）中的需求提供测试用例数据，
             <ul sytle="margin-left: 100px;">
              <li>例1: 初始代码需要的参数是字符串，如: foo(str) 则input数据直接提供 'abcde'</li>
              <li>例2: 初始代码需要的数据是数组:如 foo(array) 则input数据也提供数组 [1,2,3,'d']</li>
              <li>例3: 初始代码需要的数据是组合数据:如 foo(array, number) 则input数据为 [1,2,3,'d'], 4 用逗号做间隔即可</li>
              <li>output的内容直接填写程序执行后预期应得到的结果</li>
              <li>提交时，请检查字符串的 " " ，数组的 [ ] ，对象的 { } 是否编辑正确，数据间是否用逗号做了正确的间隔，并避免使用中文的全角符号</li>
            </ul>
           </div>
        </el-form-item>
        <!-- 自动生成 testcases switch 暂不停供-->
        <!-- <el-form-item label="Is Auto Build">
          <el-switch v-model="auto" active-color="#13ce66" inactive-color="#409eff" disabled
                     :active-text="$t('common.addTest.auto')" :inactive-text="$t('common.addTest.manully')">
          </el-switch>
        </el-form-item> -->
      </el-form>

      <!-- testcases 增删表格 -->
      <el-table :data="this.testcases.mergedCases" empty-text="No Data" stripe>
        <el-table-column align="center" label="Testcases">
          <el-table-column  width="55">
            <template slot-scope="scope">
              <i class="el-icon-error" @click="handleDelete(scope.$index, scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column label="idx" width="50">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="input" min-width="45%">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.inputStr"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="output" min-width="45%">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.outputStr"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- <el-row v-if="this.testcases.isAutoBuild" :label="$t('common.addTest.buildingCode')">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 7}" v-model="test.buildingCode"></el-input>
      </el-row> -->

      <!-- testcases删改功能按钮 -->
      <div v-if="!this.testcases.isAutoBuild" class="testCasesBtn">
          <el-button icon="el-icon-plus" type="primary" @click="addOneRow" >Add New Case</el-button>
          <el-button icon="el-icon-refresh-right" type="warning" @click="revertTestCase" >Revert To Last Save</el-button>
          <el-button icon="el-icon-edit-outline" plain type="success" @click="tempSave" >Temporary Save</el-button>
          <el-button icon="el-icon-check" type="success" @click="saveAndCreate" >Confirm Changes</el-button>
      </div>

      <!-- JudgeProgram 测试程序选择表格 -->
      <el-table :data="testPrograms" highlight-current-row>
        <el-table-column align="center" label="Choose The Judge Program">
          <el-table-column  width="180" label="Selected one is activated" align="center">
            <template slot-scope="scope">
              <el-radio v-model="testProgramId" :label="scope.row.id" @change="changeJudgeProgram"> </el-radio>
            </template>
          </el-table-column>
          <el-table-column type="expand" :label="$t('common.addTest.showCode')" width="150">
            <template slot-scope="props">
              <el-form label-position="right" inline class="demo-table-expand">
                <el-form-item>
                  <pre>{{ props.row.testCode }}</pre>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="id" :label="$t('common.addTest.tpId')" width="50"></el-table-column> -->
          <el-table-column prop="programLang" :label="$t('common.addTest.programCode')" :formatter="formatToFullName" width="210"></el-table-column>
          <el-table-column prop="inputDataStructure" :label="$t('common.addTest.inputDataStructure')" width="210"></el-table-column>
          <el-table-column prop="outputDataStructure" :label="$t('common.addTest.outputDataStructure')" width="210"></el-table-column>
        </el-table-column>
      </el-table>
      <!-- <div>
        <el-button type="primary" @click="saveForm('test')">{{$t('common.addTest.save')}}</el-button>
        <el-button @click="cancel()">{{$t('common.createQuestion.cancel')}}</el-button>
        <el-button @click="createFile()">{{$t('common.addTest.createFile')}}</el-button>
      </div> -->
    </div>
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
  data () {
    return {
      testProgramId: 0,
      testPrograms: [],
      testcases: {},
      mergedCases: [],
      question: {},

      editorOption: {
        // linueSeparator: null,
        lineNumbers: true,
        autohint: true
        // readOnly: true
      },
      // 不知所云的分界线
      rules: {
        topic: [],
        inputData: [
        ],
        outputData: [],
        inputDataStructure: [],
        outputDataStructure: [],
        testCode: []
      },

      isEdit: false,
      programLang: '',
      uId: sessionStorage.getItem('id'),
      cqId: this.$route.params.id,
      num: 1,
      id: '',
      inputPlaceHolder: '',
      outputPlaceHolder: '',
      currentRow: null,
      submitInput: [],
      submitOutput: [],
      auto: false
    }
  },
  async created () {
    this.$api.get('codingQuestions/' + this.cqId, null, res => {
      // console.log(res)
      this.question.id = res.id
      this.question.topic = res.topic
      this.question.preCode = res.preCode
      this.question.mode = 'javascript'
      this.testProgramId = res.tpId
      console.log(this.testProgramId)

      // 获取测试代码（是否必要？）
      let testProgramData = {
        programLang: res.programLang,
        status: 'done'
      }
      this.$api.get('testPrograms', testProgramData, res => {
        this.testPrograms = res
        let data = {
          cqId: this.cqId
        }
        // 获取测试用例
        this.$api.get('testcases', data, res => {
          // this.isEdit = true
          // this.id = res[0].id
          this.testcases = res[0]
          this.testcases.mergedCases = []
          this.mergeTestCases(res[0].inputData, res[0].outputData)
        }, res => {})
      }, res => {})
    }, res => {})
  },
  computed: {
  },
  methods: {
    mergeTestCases (inputData, outputData) {
      if (inputData !== null) {
        inputData = JSON.parse(inputData)
      }
      if (outputData !== null) {
        outputData = JSON.parse(outputData)
      }
      // console.log(this.testcases.inputData)
      // console.log(this.testcases.outputData)
      let mergedCases = []
      inputData.forEach((inputItem, inputIndex) => {
        let row = {
          // index: inputIndex,
          inputStr: this.formatJSON(inputItem),
          outputStr: this.formatJSON(outputData[inputIndex])
        }
        mergedCases.push(row)
      })
      this.testcases.mergedCases = mergedCases
    },
    changeJudgeProgram (tpId) {
      // console.log(this.question.id)
      // console.log(tpId)
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          tpId
        }
      }

      this.$api.put('codingQuestions/' + this.question.id, data, res => {
        this.$message({
          message: '测试代码已经更改',
          type: 'success'
        })
      }, res => {
        this.$alert(res.data.error, 'FAIL')
      })
    },
    formatToFullName (row) {
      switch (row.programLang) {
        case 'js':
          return 'Javascript'
        case 'cpp':
          return 'c++ program'
        case 'c':
          return 'c program'
        case 'java':
          return 'Java'
        default: return row.programLang
      }
    },
    setInputValue (index, value) {
      value = '[' + value + ']'
      try {
        value = JSON.parse(value)
      } catch (e) {
        console.log('no')
      }
      console.log(index, value)
    },
    formatJSON (value) {
      let str = JSON.stringify(value).slice(1, -1)
      return str
    },
    revertTestCase () {
      console.log(this.testcases.id)
      // 获取测试用例
      this.$api.get('testcases/' + this.testcases.id, null, res => {
        // console.log(res)
        // this.isEdit = true
        // this.id = res[0].id
        this.testcases = res
        this.testcases.mergedCases = []
        this.mergeTestCases(res.inputData, res.outputData)
      }, res => {})
    },
    // 修改数据库中对应信息，但不改变对应testcase
    tempSave () {
      return new Promise((resolve, reject) => {
        let data = {
          inputData: '',
          outputData: ''
        }
        this.testcases.mergedCases.forEach((item, index) => {
          data.inputData += ('[' + item.inputStr + '],')
          data.outputData += ('[' + item.outputStr + '],')
          data.status = 'edit'
        })

        data.inputData = '[' + data.inputData.slice(0, -1).replace(/\s/ig, '') + ']'
        data.outputData = '[' + data.outputData.slice(0, -1).replace(/\s/ig, '') + ']'

        // console.log(data.outputData)
        let newData = {
          '_csrf': this.$cookies.get('csrfToken'),
          data
        }

        this.$api.put('testcases/' + this.testcases.id, newData, res => {
          this.$message({
            message: '数据保存成功',
            type: 'success'
          })
          resolve(true)
        }, res => {
          this.$alert(res.data.error, '保存失败')
          reject(new Error('save fail'))
        })
      })
    },
    async saveAndCreate () {
      let isCreate = false
      try {
        isCreate = await this.tempSave()
      } catch (e) {
        isCreate = false
      }

      if (isCreate) {
        console.log('create start')
        console.log(this.testcases.id)
        // 修改 testcase 的状态为 done
        let data = {
          '_csrf': this.$cookies.get('csrfToken'),
          'data': {
            status: 'done'
          }
        }
        this.$api.put('testcases/' + this.testcases.id, data, res => {
          // 在 oj_reserve 中生成用例文件
          let data = {
            '_csrf': this.$cookies.get('csrfToken'),
            'data': {
              type: 'testcases', // 指定要生成的文件类型
              id: this.testcases.id // 此处为 testcases表中的 id
              // 无需指定编程语言，会根据上 表中记录自动匹配
            }
          }
          console.log(data)
          this.$api.post('createJsFile', data, res => {
            this.$message({
              message: '成功的生成了文件',
              type: 'success'
            })
          }, res => {
            console.log(res.data)
          })
        }, res => {
          this.$message({
            type: 'error',
            message: this.$t('message.addTest.testcaseNotFound')
          })
        })
      } else {
        console.log('create cancel')
      }
    },
    cancel () {
      this.$router.push('/createdQuestions')
    },
    addOneRow () {
      let row = {
        // index: this.testcases.mergedCases.length,
        inputStr: '',
        outputStr: ''
      }
      this.testcases.mergedCases.push(row)
    },
    handleDelete (index, row) {
      this.testcases.mergedCases.splice(index, 1)
    }
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
      width: 600px;
      min-width: 180px;
    }

    /* .customizeRow div .el-form-item__content{
      display: none;
      margin-left: 0 !important;
    } */
    .el-form {
      padding-top: 0px;
    }

    .container {
      min-width: 960px;
      /* width: 70%; */
    }
    .demo-table-expand {
    font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }

    .el-icon-error {
      padding: 5px 5px;
      font-size: 20px;
      color: #F56C6C;
    }

    .el-icon-error:hover {
      color: #909399;
    }

    #initCode {
        border: 1px solid #eee;
        height: 120px;
        width: 500px;
    }

    #initCode {
      height: 120px;
      overflow-y: auto;
      overflow-x: auto;
    }

    .testCasesBtn{
      margin: 15px 0px 50px;
    }
</style>
