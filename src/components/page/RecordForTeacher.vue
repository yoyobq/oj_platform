<template>
  <div class="codingRecordTable">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.recordForTeacher.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="codingRecordContainer">
      <el-checkbox v-model="done" style="margin-left:20px;">{{$t('common.recordForTeacher.onlyDone')}}</el-checkbox>
      <el-input :placeholder="$t('common.recordForTeacher.searchQuestion')" v-model="searchInput" class="searchInput">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-table :data="tableData">
        <el-table-column width="140%">
          <template slot="header">
            <el-button type="text"
            @click="sortId()">{{$t('common.recordForTeacher.crId')}}<span class="el-icon-d-caret"></span></el-button>
          </template>
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="realName" :label="$t('common.recordForTeacher.realName')">
        </el-table-column>
        <el-table-column prop="topic" :label="$t('common.recordForTeacher.topic')">
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <el-button type="text"
            @click="sortMem()">{{$t('common.recordForTeacher.mem')}}<span class="el-icon-d-caret"></span></el-button>
          </template>
          <template slot-scope="scope">
            {{scope.row.memUsage}}kb
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <el-button type="text"
            @click="sortTime()">{{$t('common.recordForTeacher.time')}}<span class="el-icon-d-caret"></span></el-button>
          </template>
          <template slot-scope="scope">
            {{scope.row.timeUsage}}ms
          </template>
        </el-table-column>
        <el-table-column>
          <template slot="header">
            <el-button type="text"
            @click="sortDate()">{{$t('common.recordForTeacher.date')}}<span class="el-icon-d-caret"></span></el-button>
          </template>
          <template slot-scope="scope">
            {{scope.row.solveDate}}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.recordForTeacher.status')">
        </el-table-column>
        <el-table-column :label="$t('common.recordForTeacher.operate')">
          <template slot-scope="scope">
            <el-button size="mini"
            @click="checkCoding(scope.row)">{{$t('common.recordForTeacher.checkCode')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
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
      pageSize: 10,
      currentPage: 1,
      sortType: 'id',
      sId: false,
      sMem: false,
      sTime: false,
      sDate: false
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
    this.totalTableData = this.record.concat()
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
      switch (this.sortType) {
        case 'id': this.sortId()
          break
        case 'mem': this.sortMem()
          break
        case 'time': this.sortTime()
          break
        case 'date': this.sortDate()
          break
      }
      this.total = this.totalTableData.length
      this.tableData = this.totalTableData.slice(0, this.pageSize).concat()
    }
  },
  methods: {
    checkCoding (row) {
      this.$alert('<PRE>' + row.code + '</PRE>', this.$t('common.recordForTeacher.checkCode'), {
        confirmButtonText: this.$t('common.recordForTeacher.ok'),
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
      this.tableData = this.totalTableData.slice((val - 1) * 10, (val - 1) * 10 + 10).concat()
    },
    sortId () {
      this.sortType = 'id'
      let copy = []
      if (this.sId) {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if (this.totalTableData[i].id > this.totalTableData[j].id) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sId = false
      } else {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if (this.totalTableData[i].id < this.totalTableData[j].id) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sId = true
      }
      this.tableData = this.totalTableData.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + 10).concat()
    },
    sortMem () {
      this.sortType = 'mem'
      let copy = []
      if (this.sMem) {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if (this.totalTableData[i].memUsage < this.totalTableData[j].memUsage) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sMem = false
      } else {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if (this.totalTableData[i].memUsage > this.totalTableData[j].memUsage) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sMem = true
      }
      this.tableData = this.totalTableData.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + 10).concat()
    },
    sortTime () {
      this.sortType = 'time'
      let copy = []
      if (this.sTime) {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if (this.totalTableData[i].timeUsage > this.totalTableData[j].timeUsage) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sTime = false
      } else {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if (this.totalTableData[i].timeUsage < this.totalTableData[j].timeUsage) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sTime = true
      }
      this.tableData = this.totalTableData.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + 10).concat()
    },
    sortDate () {
      this.sortType = 'date'
      let copy = []
      if (this.sDate) {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if ((this.totalTableData[i].solveDate < this.totalTableData[j].solveDate && this.totalTableData[j].solveDate !== 'not done') || (this.totalTableData[i].solveDate === 'not done' && this.totalTableData[j] !== 'not done')) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sDate = false
      } else {
        for (let i = 0; i < this.totalTableData.length - 1; i++) {
          for (let j = i + 1; j < this.totalTableData.length; j++) {
            if ((this.totalTableData[i].solveDate > this.totalTableData[j].solveDate && this.totalTableData[j].solveDate !== 'not done') || (this.totalTableData[i].solveDate === 'not done' && this.totalTableData[j] !== 'not done')) {
              copy = JSON.parse(JSON.stringify(this.totalTableData[i]))
              this.totalTableData[i] = JSON.parse(JSON.stringify(this.totalTableData[j]))
              this.totalTableData[j] = JSON.parse(JSON.stringify(copy))
            }
          }
        }
        this.sDate = true
      }
      this.tableData = this.totalTableData.slice((this.currentPage - 1) * 10, (this.currentPage - 1) * 10 + 10).concat()
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