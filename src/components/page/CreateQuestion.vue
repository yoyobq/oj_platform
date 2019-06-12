<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <div v-if="!isEdit"><el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createQuestion.title')}}</el-breadcrumb-item></div>
        <div v-else>
          <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createdQuestions.title')}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t('common.createQuestion.editTitle')}}</el-breadcrumb-item>
        </div>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-form :model="question" :rules="rules" ref="question" label-width="200px" size="medium" >
        <el-form-item :label="$t('common.createQuestion.topic')" prop="topic">
          <el-input v-model="question.topic"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.describe')" prop="describe">
          <el-input type="textarea" v-model="question.describe"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.hint')" prop="hint">
          <el-input type="textarea" v-model="question.hint"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.programLang')" prop="programLang">
          <el-select v-model="question.programLang" :placeholder="$t('message.createQuestion.inputProgramLang')" @change="changePreCode()">
            <el-option label="javascript" value="js"></el-option>
            <el-option label="java" value="java"></el-option>
            <el-option label="c" value="c"></el-option>
            <el-option label="c++" value="c++"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.memLimit')" prop="memLimit">
          <el-input v-model="question.memLimit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.timeLimit')" prop="timeLimit">
          <el-input v-model="question.timeLimit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.preCode')" prop="preCode">
          <el-input type="textarea" v-model="question.preCode" :autosize="{ minRows: 4, maxRows: 7}"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.preFuncName')" prop="preFuncName">
          <el-input v-model="question.preFuncName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.createQuestion.hiddenCode')" prop="hiddenCode">
          <el-input v-model="question.hiddenCode"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('question')">{{$t('common.createQuestion.submit')}}</el-button>
          <el-button @click="cancel()">{{$t('common.createQuestion.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      question: {
        topic: '',
        describe: '',
        hint: '',
        programLang: '',
        memLimit: '',
        timeLimit: '',
        preCode: '',
        preFuncName: '',
        uId: '',
        hiddenCode: ''
      },
      rules: {
        topic: [
          { required: true, message: this.$t('message.createQuestion.inputTopic'), trigger: 'blur' },
          { min: 2, max: 50, message: this.$t('message.createQuestion.topicLength'), trigger: 'blur' }
        ],
        describe: [
          { max: 200, message: this.$t('message.createQuestion.describeLength'), trigger: 'blur' }
        ],
        hint: [
          { max: 200, message: this.$t('message.createQuestion.hintLength'), trigger: 'blur' }
        ],
        programLang: [
          { required: true, message: this.$t('message.createQuestion.inputProgramLang'), trigger: 'blur' }
        ],
        memLimit: [
          {
            pattern: /^[\d-]+$/,
            message: this.$t('message.createQuestion.memLimitForm'),
            trigger: 'blur'
          }
        ],
        timeLimit: [
          {
            pattern: /^[\d-]+$/,
            message: this.$t('message.createQuestion.memLimitForm'),
            trigger: 'blur'
          }
        ],
        preCode: [
          { required: true, message: this.$t('message.createQuestion.inputPreCode'), trigger: 'blur' }
        ],
        preFuncName: [
          { required: true, message: this.$t('message.createQuestion.inputPreFuncName'), trigger: 'blur' },
          { min: 2, max: 50, message: this.$t('message.createQuestion.preFuncNameLength'), trigger: 'blur' }
        ]
      },
      isEdit: false
    }
  },
  async created () {
    this.question.uId = sessionStorage.getItem('id')
    if (this.$route.params.id) {
      this.isEdit = true
      this.$api.get('codingQuestions/' + this.$route.params.id, null, res => {
        this.question = res
      }, res => {})
    }
  },
  computed: {
  },
  watch: {
    $route (to, from) {
      this.question = {}
      this.isEdit = false
      this.question.uId = sessionStorage.getItem('id')
      if (this.$route.params.id) {
        this.isEdit = true
        this.$api.get('codingQuestions/' + this.$route.params.id, null, res => {
          this.question = res
        }, res => {})
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'data': this.question
            }
            this.$api.put('codingQuestions/' + this.$route.params.id, data, res => {
              this.$router.push('/createdQuestions')
            }, res => {})
          } else {
            let data = {
              '_csrf': this.$cookies.get('csrfToken'),
              'data': this.question
            }
            this.$api.post('codingQuestions', data, res => {
              this.$router.push('/createdQuestions')
            }, res => {})
          }
        }
      })
    },
    changePreCode () {
      switch (this.question.programLang) {
        case 'js': this.question.preCode = 'function sumArr(array) {\n  // 在此添加代码\n}\n\nmodule.exports = sumArr'
      }
    },
    cancel () {
      this.$router.push('/createdQuestions')
    }
  }
}
</script>
<style scoped>
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
</style>
