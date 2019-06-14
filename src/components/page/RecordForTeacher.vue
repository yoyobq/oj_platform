<template>
  <div class="codingRecordTable">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingRecord.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="codingRecordContainer">
      <el-checkbox v-model="done" style="margin-left:20px;">{{$t('common.recordForTeacher.onlyDone')}}</el-checkbox>
      <el-input :placeholder="$t('common.recordForTeacher.searchQuestion')" v-model="searchInput" class="searchInput">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-table :data="tableData" :default-sort = "{prop: 'id', order: 'ascending'}">
        <el-table-column prop="id" label="答题编号" sortable width="140%">
        </el-table-column>
        <el-table-column prop="realName" label="学生姓名">
        </el-table-column>
        <el-table-column prop="topic" label="题目">
        </el-table-column>
        <el-table-column prop="memUsage" label="内存(kb)" sortable>
        </el-table-column>
        <el-table-column prop="timeUsage" label="时间(ms)" sortable>
        </el-table-column>
        <el-table-column prop="solveDate" label="完成时间" sortable>
        </el-table-column>
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
            @click="checkCoding(scope.row)">查看代码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
        @current-change="currentChange">
      </el-pagination>
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
      totalTableData: [],
      pageCount: 100,
      visible: false,
      code: '',
      uId: '',
      done: false,
      record: [],
      searchInput: '',
      total: 10,
      pageSize: 10
    }
  },
  async created () {
    this.uId = sessionStorage.getItem('id')
    this.record = await this.getRecord()
    let questionList = await this.getQuestion()
    let stuInfos = await this.getStuInfo()
    this.total = this.record.length
    let map = new Map()
    for (let question of questionList) {
      map.set(question.id, question.topic)
    }
    for (let item of this.record) {
      item.topic = map.get(item.cqId)
    }
    map = new Map()
    for (let stuInfo of stuInfos) {
      map.set(stuInfo.id, stuInfo.realName)
    }
    for (let item of this.record) {
      item.realName = map.get(item.uId)
      if (item.solveDate !== null) {
        item.solveDate = new Date(item.solveDate).toLocaleString('chinese', { hour12: false })
      } else {
        item.solveDate = 'not done'
      }
    }
    this.tableData = this.record.slice(0, this.pageSize).concat()
  },
  watch: {
    done: function (val) {
      this.tableData = []
      this.totalTableData = []
      if (val) {
        for (let i in this.record) {
          if (this.record[i].status === 'done' && this.record[i].topic.indexOf(this.searchInput) > -1) {
            this.totalTableData.push(this.record[i])
          }
        }
      } else {
        for (let i in this.record) {
          if (this.record[i].topic.indexOf(this.searchInput) > -1) {
            this.totalTableData.push(this.record[i])
          }
        }
      }
      this.total = this.totalTableData.length
      this.tableData = this.totalTableData.slice(0, this.pageSize).concat()
    }
  },
  methods: {
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
    },
    getStuInfo () {
      return new Promise((resolve, reject) => {
        this.$api.get('stuInfos', null, res => {
          resolve(res)
        }, res => {
          resolve(false)
        })
      })
    },
    search () {
      this.tableData = []
      this.totalTableData = []
      for (let i in this.record) {
        if (this.record[i].topic.indexOf(this.searchInput) > -1) {
          if (this.record[i].status === 'done' || this.done === false) {
            this.totalTableData.push(this.record[i])
          }
        }
      }
      this.total = this.totalTableData.length
      this.tableData = this.totalTableData.slice(0, this.pageSize).concat()
    },
    currentChange (val) {
      this.tableData = this.totalTableData.slice((val - 1) * 10, (val - 1) * 10 + 9).concat()
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
.searchInput{
  width:30%;
  float: right;
  margin-right: 10px;
}
</style>