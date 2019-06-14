<template>
  <div class="codingQuestionTable">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingQuestion.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="codingQuestionContainer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="编号">
        </el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <el-button type="text" @click="selectQuestion(scope.row.id)">{{ scope.row.topic }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="programLang" label="编程语言">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size="10"
      :total="pageCount">
    </el-pagination>
  </div>
</template>
<script>
export default{
  data () {
    return {
      tableData: [],
      pageCount: 100
    }
  },
  created () {
    let data = {
      status: 'public'
    }
    this.$api.get('codingQuestions/count', data, res => {
      this.pageCount = res
      this.getQuestions(0)
    }, res => {
      console.log(res.data)
    })
  },
  methods: {
    getQuestions (page) {
      let data = {
        status: 'public',
        limit: 10,
        offset: page

      }
      this.$api.get('codingQuestions', data, res => {
        this.tableData = res
      }, res => {})
    },
    selectQuestion (id) {
      this.$router.push('/codingTest?id=' + id)
    },
    handleCurrentChange (val) {
      this.getQuestions((val - 1) * 10)
    }
  }
}
</script>
<style>
.codingQuestionContainer {
  width: 60%;
  width: 60%;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px
}
</style>