<template>
    <el-card>
      <div class="clearfix" >
        <div class="questHead">
          <span>[ {{ index + 1 }} ]</span>
          <span>{{ title }}</span>
        </div>
      </div>
      <el-checkbox-group v-model="currentAnswer" @change="checkAnswer">
        <div v-for='(option, optIndex) in options' :key="optIndex">
          <div v-if="option != null">
            <el-checkbox :label="optList[optIndex]">
              {{ optList[optIndex] }}
              <div class="optText">{{ option }}</div>
            </el-checkbox>
          </div>
        </div>
      </el-checkbox-group>
     </el-card>
</template>

<script>
export default {
  props: ['quest', 'index'],
  data: function () {
    return {
      optList: ['A', 'B', 'C', 'D', 'E', 'F'],
      title: this.quest.quest_Title,
      answer: this.quest.quest_Answer,
      currentAnswer: [],
      stuAnswer: [], // 由于多选题答案是一个数组，声明时也必须声明成数组，否则会出错，element UI
      options: []
    }
  },
  methods: {
    checkAnswer: function () {
      this.stuAnswer = this.currentAnswer.sort().join('')
      let data = {
        'stuAnswer': this.stuAnswer,
        '_csrf': this.$cookies.get('csrfToken')
      }
      this.$api.put('api/v1/examRecords/' + this.quest.record_id, data, res => {
        // console.log(res)
      }, res => {
        window.alert('服务器出错，答案无法提交，请检查网络！')
        this.stuAnswer = ''
      })
    }
  },
  created () {
    this.options = [this.quest.quest_A, this.quest.quest_B, this.quest.quest_C, this.quest.quest_D, this.quest.quest_E, this.quest.quest_F]
    // console.log(this.options)
    if (this.quest.exam_StuAnswer !== '-1') {
      this.currentAnswer = this.quest.exam_StuAnswer.split('')
    }
  }
}
</script>

<style scoped>
.el-checkbox-group{
  display: inline-block;
  max-width: 85%;
  padding-left: 40px;
}

.el-checkbox{
  display:block;
  margin: 10px;
  height: auto;
  position:relative;
}

.questHead{
  max-width: 90%;
  display: inline-block;
  margin-bottom: 0.8em;
  font-size: 1.3em;
  font-weight: 700;
  padding-left: 1.5em;
}

.optText{
  font-size: 1.3em;
  margin: 0.5em 1em 0.5em 0.8em;
  word-break: break-word;
  white-space: normal;
  display:inline-block;
}
</style>
