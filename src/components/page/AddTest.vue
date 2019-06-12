<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createdQuestions.title')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('common.addTest.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form :model="test" :rules="rules" ref="test" label-width="200px" size="medium" >
        <el-form-item :label="$t('common.addTest.topic')">
          {{test.topic}}
          <el-switch style="display: block" v-model="auto" active-color="#13ce66" inactive-color="#ff4949" :active-text="$t('common.addTest.byHand')" :inactive-text="$t('common.addTest.auto')"></el-switch>
        </el-form-item>
        <el-form-item :key="i" v-for="i in num" :label="$t('common.addTest.data')+i">
          <el-select v-model="test.inputDataStructure" :placeholder="$t('common.addTest.inputDataStructure')" @change="changeInput()">
            <el-option label="value" value="value"></el-option>
            <el-option label="array" value="array"></el-option>
            <el-option label="matrix" value="matrix"></el-option>
            <el-option label="listNode" value="listNode"></el-option>
            <el-option label="string" value="string"></el-option>
            <el-option label="tree" value="tree"></el-option>
          </el-select>
          <el-input v-model="test.inputData[i-1]" :placeholder="inputPlaceHolder"></el-input>
          <el-select v-model="test.outputDataStructure" :placeholder="$t('common.addTest.outputDataStructure')" @change="changeOutput()">
            <el-option label="value" value="value"></el-option>
            <el-option label="array" value="array"></el-option>
            <el-option label="matrix" value="matrix"></el-option>
            <el-option label="listNode" value="listNode"></el-option>
            <el-option label="string" value="string"></el-option>
            <el-option label="tree" value="tree"></el-option>
          </el-select>
          <el-input v-model="test.outputData[i-1]" :placeholder="outputPlaceHolder"></el-input>
        </el-form-item>
        <el-form-item v-if="auto" :label="$t('common.addTest.buildingCode')">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 7}" v-model="test.buildingCode"></el-input>
        </el-form-item>
        <el-form-item v-if="!auto">
          <el-button icon="el-icon-plus" size="mini" type="danger" @click="addOneRow()" round></el-button>
          <el-button icon="el-icon-minus" size="mini" type="danger" @click="minusOneRow()" round></el-button>
        </el-form-item>
        <el-form-item :label="$t('common.addTest.testProgram')">
          <el-table ref="singleTable" :data="testPrograms" highlight-current-row @current-change="handleCurrentChange" style="width: 80%">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="判题程序代码">
                    <PRE>{{ props.row.testCode }}</PRE>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="programLang" label="语言"></el-table-column>
            <el-table-column prop="inputDataStructure" label="输入结构"></el-table-column>
            <el-table-column prop="outputDataStructure" label="输出结构"></el-table-column>
          </el-table>
           <div style="margin-top: 20px">
            <el-button @click="setCurrent()">取消选择</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveForm('test')">{{$t('common.addTest.save')}}</el-button>
          <el-button @click="cancel()">{{$t('common.createQuestion.cancel')}}</el-button>
          <el-button @click="createFile()">{{$t('common.addTest.createFile')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      test: {
        topic: '',
        inputData: [],
        outputData: [],
        inputDataStructure: '',
        outputDataStructure: '',
        testCode: '',
        programLang: '',
        buildingCode: '',
        isAutoBuild: 0
      },
      rules: {
        topic: [],
        inputData: [
        ],
        outputData: [],
        inputDataStructure: [],
        outputDataStructure: [],
        testCode: []
      },
      testPrograms: [],
      isEdit: false,
      programLang: '',
      uId: sessionStorage.getItem('id'),
      cqId: this.$route.params.id,
      tpId: '',
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
      this.test.topic = res.topic
      this.tpId = res.tpId
      this.test.programLang = res.programLang
      this.$api.get('testPrograms', {status: 'done'}, res => {
        this.testPrograms = res
        if (this.tpId !== null) {
          this.$api.get('testPrograms/' + this.tpId, null, res => {
            this.test.inputDataStructure = res.inputDataStructure
            this.test.outputDataStructure = res.outputDataStructure
            // this.test.testCode = res.testCode
            this.changeInput()
            this.changeOutput()
            for (let i in this.testPrograms) {
              if (this.tpId === this.testPrograms[i].id) {
                this.setCurrent(this.testPrograms[i])
              }
            }
          }, res => {})
        }
        let data = {
          cqId: this.cqId
        }
        this.$api.get('testcases', data, res => {
          this.isEdit = true
          this.id = res[0].id
          if (res[0].inputData !== null) {
            this.test.inputData = JSON.parse(res[0].inputData)
            for (let i in this.test.inputData) {
              this.test.inputData[i] = JSON.stringify(this.test.inputData[i])
            }
            /* switch (this.test.inputDataStructure) {
              case 'value':
                break
              case 'array':
                res[0].inputData = JSON.parse(res[0].inputData)
                for (let i in res[0].inputData) {
                  for (let j in res[0].inputData[i]) {
                    if (typeof res[0].inputData[i][j] !== 'number') {
                      res[0].inputData[i][j] = '"' + res[0].inputData[i][j] + '"'
                    }
                  }
                  this.test.inputData[i] = '[' + res[0].inputData[i].join(',') + ']'
                }
                break
              case 'matrix':
                break
              case 'listNode':
                break
              case 'string':
                break
              case 'tree':
                break
            } */
          }
          if (res[0].outputData !== null) {
            this.test.outputData = JSON.parse(res[0].outputData)
            for (let i in this.test.outputData) {
              this.test.outputData[i] = JSON.stringify(this.test.outputData[i])
            }
            /* switch (this.test.outputDataStructure) {
              case 'value':
                this.test.outputData = JSON.parse(res[0].outputData)
                break
              case 'array':
                res[0].outputData = JSON.parse(res[0].outputData)
                for (let i in res[0].outputData) {
                  for (let j in res[0].outputData[i]) {
                    if (typeof res[0].outputData[i][j] !== 'number') {
                      res[0].outputData[i][j] = '"' + res[0].outputData[i][j] + '"'
                    }
                  }
                  this.test.outputData[i] = '[' + res[0].outputData[i].join(',') + ']'
                }
                break
              case 'matrix':
                break
              case 'listNode':
                break
              case 'string':
                break
              case 'tree':
                break
            } */
          }
          if (this.test.inputData.length > 0) {
            this.num = this.test.inputData.length
          } else {
            this.num = 1
          }
          this.test.isAutoBuild = res[0].isAutoBuild
          if (this.test.isAutoBuild === 1) {
            this.auto = true
          }
          this.test.buildingCode = res[0].buildingCode
        }, res => {})
      }, res => {})
    }, res => {})
  },
  computed: {
  },
  watch: {
    auto: function (val) {
      if (val === true) {
        this.num = 0
        this.test.isAutoBuild = 1
      } else {
        this.test.isAutoBuild = 0
        if (this.test.inputData.length > 0) {
          this.num = this.test.inputData.length
        } else {
          this.num = 1
        }
      }
    }
  },
  methods: {
    saveForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.currentRow !== null) {
            if (this.currentRow.inputDataStructure !== this.test.inputDataStructure && this.currentRow.outputDataStructure !== this.test.outputDataStructure) {
              this.$message({
                type: 'error',
                message: this.$t('message.addTest.notMatch')
              })
              return false
            }
            if (this.test.programLang !== this.currentRow.programLang) {
              this.$message({
                type: 'error',
                message: this.$t('message.addTest.programLangNotMatch')
              })
              return false
            }
          }
          for (let i in this.test.inputData) {
            if (this.test.inputData[i] === '') {
              this.test.inputData.splice(i, 1)
              this.test.outputData.splice(i, 1)
            }
          }
          let inputData = []
          let outputData = []
          for (let i in this.test.inputData) {
            inputData[i] = JSON.parse(this.test.inputData[i])
            outputData[i] = JSON.parse(this.test.outputData[i])
          }
          /* switch (this.test.inputDataStructure) {
            case 'value':
              for (let i in this.test.inputData) {
                this.submitInput[i] = parseInt(this.test.inputData[i])
              }
              break
            case 'array':
              for (let i in this.test.inputData) {
                this.submitInput[i] = this.test.inputData[i].substring(1, this.test.inputData[i].length - 1).split(',')
                for (let j in this.submitInput[i]) {
                  if (this.submitInput[i][j].indexOf('\'') === -1 && this.submitInput[i][j].indexOf('"') === -1) {
                    this.submitInput[i][j] = parseInt(this.submitInput[i][j])
                  } else {
                    this.submitInput[i][j] = this.submitInput[i][j].substring(1, this.submitInput[i][j].length - 1)
                  }
                }
              }
              break
            case 'matrix':
              break
            case 'listNode':
              break
            case 'string':
              break
            case 'tree':
              break
          }
          switch (this.test.outputDataStructure) {
            case 'value':
              for (let i in this.test.outputData) {
                this.submitOutput[i] = parseInt(this.test.outputData[i])
              }
              break
            case 'array':
              for (let i in this.test.outputData) {
                this.submitOutput[i] = this.test.outputData[i].substring(1, this.test.outputData[i].length - 1).split(',')
                for (let j in this.submitInput[i]) {
                  if (this.submitOutput[i][j].indexOf('\'') === -1 && this.submitOutput[i][j].indexOf('"') === -1) {
                    this.submitOutput[i][j] = parseInt(this.submitOutput[i][j])
                  }
                }
              }
              break
            case 'matrix':
              break
            case 'listNode':
              break
            case 'string':
              break
            case 'tree':
              break
          } */
          if (this.isEdit) {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'data': {
                inputData: JSON.stringify(inputData),
                outputData: JSON.stringify(outputData),
                status: 'done',
                isAutoBuild: this.test.isAutoBuild,
                buildingCode: this.test.buildingCode
              }
            }
            this.$api.put('testcases/' + this.id, data, res => {
              if (this.currentRow !== null) {
                let data = {
                  '_csrf': this.$cookies.get('csrfToken'),
                  'data': {
                    tpId: this.currentRow.id,
                    status: 'public'
                  }
                }
                this.$api.put('codingQuestions/' + this.cqId, data, res => {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.addTest.changeSucceed')
                  })
                }, res => {})
              } else {
                this.$message({
                  type: 'success',
                  message: this.$t('message.addTest.changeSucceed')
                })
              }
            }, res => {})
          } else {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'data': {
                cqId: this.cqId,
                inputData: JSON.stringify(inputData),
                outputData: JSON.stringify(outputData),
                status: 'done',
                isAutoBuild: this.test.isAutoBuild,
                buildingCode: this.test.buildingCode
              }
            }
            this.$api.post('testcases', data, res => {
              if (this.currentRow !== null) {
                let data = {
                  '_csrf': this.$cookies.get('csrfToken'),
                  'data': {
                    tpId: this.currentRow.id,
                    status: 'public'
                  }
                }
                this.$api.put('codingQuestions/' + this.cqId, data, res => {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.addTest.changeSucceed')
                  })
                }, res => {})
              } else {
                this.$message({
                  type: 'success',
                  message: this.$t('message.addTest.changeSucceed')
                })
              }
            }, res => {})
          }
        }
      })
    },
    createFile () {
      let data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          status: 'done'
        }
      }
      this.$api.put('testcases/' + this.id, data, res => {}, res => {
        this.$message({
          type: 'error',
          message: this.$t('message.addTest.testcaseNotFound')
        })
      })
      data = {
        '_csrf': this.$cookies.get('csrfToken'),
        'data': {
          type: 'testcases', // 指定要生成的文件类型
          id: this.id // 此处为 testcases表中的 id
          // 无需指定编程语言，会根据上 表中记录自动匹配
        }
      }
      this.$api.post('createJsFile', data, res => {
        this.$message({
          type: 'success',
          message: this.$t('message.addTest.createFileSucceed')
        })
      }, res => {
      })
    },
    cancel () {
      this.$router.push('/createdQuestions')
    },
    addOneRow () {
      this.num++
    },
    minusOneRow () {
      if (this.num > 1) {
        this.num--
        if (this.test.inputData.length > this.num) {
          this.test.inputData.pop()
          this.test.outputData.pop()
        }
      }
    },
    changeInput () {
      switch (this.test.inputDataStructure) {
        case 'array': this.inputPlaceHolder = '[1,2,3]'
          break
        case 'value': this.inputPlaceHolder = '1'
      }
      if (this.currentRow !== null) {
        if (this.test.inputDataStructure !== this.currentRow.inputDataStructure) {
          this.currentRow = null
          this.$message({
            type: 'error',
            message: this.$t('message.addTest.notMatch')
          })
          this.setCurrent()
        }
      }
    },
    changeOutput () {
      switch (this.test.outputDataStructure) {
        case 'value': this.outputPlaceHolder = '1'
          break
        case 'array': this.outputPlaceHolder = '[1,2,3]'
          break
      }
      if (this.currentRow !== null) {
        if (this.test.outputDataStructure !== this.currentRow.outputDataStructure) {
          this.currentRow = null
          this.$message({
            type: 'error',
            message: this.$t('message.addTest.notMatch')
          })
          this.setCurrent()
        }
      }
    },
    handleCurrentChange (val) {
      if (val !== undefined) {
        if (val.inputDataStructure === this.test.inputDataStructure && val.outputDataStructure === this.test.outputDataStructure && this.test.programLang === val.programLang) {
          this.currentRow = val
        } else {
          this.$message({
            type: 'error',
            message: this.$t('message.addTest.notMatch')
          })
          this.setCurrent()
        }
      }
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row)
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
      width: 500px;
      min-width: 300px;
    }

    .el-form {
      padding-top: 0px;
    }

    .container {
      min-width: 650px;
      width: 70%;
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
</style>
