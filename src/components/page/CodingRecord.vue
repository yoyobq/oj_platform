<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingRecord.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="答题编号" width="300">
        </el-table-column>
        <el-table-column prop="topic" label="题目" width="300">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="checkCoding(scope.row)">查看代码</el-button>
          </template>
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
      pageCount: 100,
      visible: false,
      code: '',
      uId: ''
    }
  },
  async created () {
    this.uId = sessionStorage.getItem('id')
    let record = await this.getRecord()
    let questionList = await this.getQuestion()
    let map = new Map()
    for (let question of questionList) {
      map.set(question.id, question.topic)
    }
    for (let item of record) {
      item.topic = map.get(item.cqId)
    }
    this.tableData = record
  },
  methods: {
    checkCoding (row) {
      this.code = row.code
      this.visible = true
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    getRecord () {
      return new Promise((resolve, reject) => {
        let data = {
          uId: this.uId
        }
        this.$api.get('codingRecords', data, res => {
          resolve(res)
        }, res => {
          resolve(false)
        })
      })
    },
    getQuestion () {
      return new Promise((resolve, reject) => {
        this.$api.get('codingQuestions', null, res => {
          resolve(res)
        }, res => {
          resolve(false)
        })
      })
    }
  }
}
</script>
<style>
.container {
  min-width: 800px;
  width: 900px;
}
</style>