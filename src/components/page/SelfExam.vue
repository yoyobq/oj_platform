<template>
  <div>
    <builder :builderShow="builderShow" @update:builderShow="builderShow = $event"  @examInfo="getExamInfo"></builder>
    <div class="que-list" v-for="(quest, index) in questions" :key="index" >
      <div v-if="quest.quest_type === 'sin'">
        <sinChoice :quest="quest" :index="index" :answer="answerRecord[index]" @update:answer="changeAnswer($event,index)"></sinChoice>
      </div>
      <div v-if="quest.quest_type === 'mul'">
        <questChoice :quest="quest" :index="index"></questChoice>
      </div>
    </div>
    <el-button type="warning" class="finish-button" @click="finishExam">完成交卷</el-button>
  </div>
</template>
<script>
import builder from '@/components/selfExam/examBulider.vue'
import questChoice from '@/components/selfExam/multipleChoice.vue'
import sinChoice from '@/components/selfExam/singleChoice.vue'

export default {
  name: 'Examine',
  components: { builder, questChoice, sinChoice },
  data () {
    return {
      title: '',
      questions: [],
      answerRecord: [],
      builderShow: false,
      examInfo: {
        libId: null,
        num: null
      }
    }
  },
  created () {
    if (this.examInfo.libId === null) {
      this.builderShow = true
    }
    // console.log(this.$children)
    // console.log(this.$session.get('examid'))
  },
  methods: {
    getExamQuestions (libId, num) {
      return new Promise((resolve, reject) => {
        let data = {
          queG_id: libId,
          limit: num
        }
        this.$api.get('questions', data, res => {
          resolve(res)
        }, res => {
          console.log(res.data.error)
          resolve(false)
        })
      })
    },
    getExamInfo (data) {
      this.examInfo = data
      this.builderShow = false
    },
    finishExam () {
      let countWrong = 0
      // console.log(this.answerRecord)
      this.questions.forEach((item, index) => {
        // console.log(item.quest_Answer, this.answerRecord[index])
        if (item.quest_Answer !== this.answerRecord[index]) {
          countWrong++
        }
      })

      let score = Math.floor(100 - 100 / this.examInfo.num * countWrong)

      this.$alert('本次考试共计' + this.examInfo.num + '题，得分' + score + '分', '提交完成', {
        confirmButtonText: '确定',
        callback: action => {
          this.$message({
            type: 'info',
            message: '本次测试完成，清除考试记录'
          })
          this.questions = []
          this.answerRecord = []
          localStorage.removeItem('self_exam_questions')
          localStorage.removeItem('self_exam_answerRecord')
          this.builderShow = true
          this.$router.go(0)
        }
      })
    },
    changeAnswer (answer, index) {
      this.answerRecord[index] = answer
      console.log(this.answerRecord)
      // 统计正确率（暂缓）
      // 上传答案
      // console.log(this.answerRecord)
      // let data = {
      //   _csrf: this.$cookies.get('csrfToken'),
      //   data: {
      //     id: this.id,
      //     answerRecord: JSON.stringify(this.answerRecord)
      //   }
      // }
      // // return new Promise((resolve, reject) => {
      // this.$api.put('exerciseRecords/' + this.id, data, res => {
      // }, res => {
      //   console.log(res.data.error)
      //   console.log(res)
      //   this.$message.error('远程服务器出错，答案只在本地记录')
      // })
      localStorage.setItem('self_exam_answerRecord', JSON.stringify(this.answerRecord))
    }
  },
  watch: {
    examInfo: async function () {
      // console.log(this.examInfo)
      this.questions = await this.getExamQuestions(this.examInfo.libId, this.examInfo.num)
      localStorage.setItem('self_exam_questions', JSON.stringify(this.questions))
      localStorage.setItem('self_exam_answerRecord', JSON.stringify(this.answerRecord))
      console.log(this.questions)
    }
  }
}
</script>
<style scoped>
.que-list{
  max-width: 960px;
  min-width: 100px;
  margin: 12px auto;
}

.finish-button {
  position: fixed;
  bottom: 10px;
  right: 10px;
}

/* html,
body,
#app,
.wrapper {
  overflow: scroll;
} */

@media (max-width: 450px){
  .el-radio__inner,.el-checkbox__inner{
    display:none;
  }
}
</style>
