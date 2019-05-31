<template>
    <el-card>
      <div>
        <div class="questHead">
          <span>[ {{ index + 1 }} ]</span>
          <span>{{ title }}</span>
        </div>
      </div>
      <el-radio-group v-model="stuAnswer" @change="checkAnswer">
        <div v-for='(option, optIndex) in options' :key="optIndex"> <!-- :key="index"> -->
          <div v-if="option != null">
            <el-radio :label="optList[optIndex]" >
              {{ optList[optIndex] }}<div class="optText">{{ option }}</div>
            </el-radio>
          </div>
        </div>
      </el-radio-group>
    </el-card>
</template>
<script>
export default {
  props: ['quest', 'index'],
  data: function () {
    return {
      optList: ['A', 'B', 'C', 'D', 'E', 'F'],
      title: this.quest.quest_Title,
      stuAnswer: '',
      options: []
    }
  },
  methods: {
    checkAnswer: function () {
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
    // console.log(this.$el)
    this.options = [this.quest.quest_A, this.quest.quest_B, this.quest.quest_C, this.quest.quest_D, this.quest.quest_E, this.quest.quest_F]
    if (this.quest.exam_StuAnswer !== -1) {
      this.stuAnswer = this.quest.exam_StuAnswer
    }
  }
}
</script>

<style scoped>
.el-radio-group {
  display: inline-block;
  max-width: 85%;
  padding-left: 40px;
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
