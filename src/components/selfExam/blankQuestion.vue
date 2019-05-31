<template>
    <el-card>
      <div class="limitPosition">
        <div class="questHead">
          <span>[ {{ index + 1 }} ]</span>
          <span>{{ title }}</span>
        </div>
        <div>
        {{$t('common.answer')}}:
        <el-input v-model="stuAnswer"/>
        </div>
      </div>
    </el-card>
</template>
<script>
export default {
  props: ['quest', 'index'],
  data () {
    return {
      title: this.quest.quest_Title,
      stuAnswer: 0,
      options: [],
      rightIcon: 'hidden',
      wrongIcon: 'hidden'
    }
  },
  methods: {
  },
  created () {
    // console.log(this.answer)
    // this.options = [this.quest.quest_A, this.quest.quest_B, this.quest.quest_C, this.quest.quest_D, this.quest.quest_E, this.quest.quest_F]
    // this.stuAnswer = this.answer
  },
  watch: {
    // 前端收到答案时的处理
    stuAnswer: function () {
      // 如果和之前给的答案不一样
      if (this.answer !== this.stuAnswer) {
        this.$emit('update:answer', this.stuAnswer)
      }
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
.el-icon-check, .el-icon-close {
  margin-right: 1em;
  position: absolute;
  bottom: 0px;
  right: 0px;
  font-size: 100px;
  font-weight: 700;
}
.limitPosition {
  position: relative;
}
.el-icon-check {
  color: #67C23A;
}
 .el-icon-close{
  color: #F56C6C;
}
.hidden {
  display: none;
}
</style>
