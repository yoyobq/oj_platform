<template>
  <div class="codingRecordTable">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingRecord.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="codingRecordContainer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="答题编号">
        </el-table-column>
        <el-table-column prop="topic" label="题目">
        </el-table-column>
        <el-table-column label="内存">
          <template slot-scope="scope">
            <span>{{ scope.row.memUsage }}kb</span>
          </template>
        </el-table-column>
        <el-table-column label="时间">
          <template slot-scope="scope">
            <span>{{ scope.row.timeUsage }}ms</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.status==='unsolved'"
              @click="contCoding(scope.row)">继续编程</el-button>
              <el-button size="mini"
              v-else
              @click="checkCoding(scope.row)">查看代码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--<el-pagination
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size="10"
      :total="pageCount">
    </el-pagination>-->
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
    contCoding (row) {
      this.$router.push('/codingTest?id=' + row.cqId)
    },
    checkCoding (row) {
      this.$alert('<PRE>' + row.code + '</PRE>', '查看代码', {
        confirmButtonText: '确定',
        dangerouslyUseHTMLString: true
      })
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
.codingRecordContainer {
  width: 80%;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px
}
</style>