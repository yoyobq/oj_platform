<template>
  <div class="codingRecordTable">
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.recordForTeacher.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 做题表 -->
    <div class="codingRecordContainer">
      <el-checkbox v-model="done" style="margin-left:20px;">{{$t('common.recordForTeacher.onlyDone')}}</el-checkbox>
      <el-input :placeholder="$t('common.recordForTeacher.searchQuestion')" v-model="searchInput" class="searchInput">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-table :data="tableData">
        <el-table-column width="50">
          <template slot="header">
            <el-button type="text"
            @click="sortId()">{{$t('common.recordForTeacher.crId')}}<span class="el-icon-d-caret"></span></el-button>
          </template>
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>
        <el-table-column prop="realName" :label="$t('common.recordForTeacher.realName')" width="100">
        </el-table-column>
        <el-table-column prop="topic" :label="$t('common.recordForTeacher.topic')" width="300">
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
        v-if=" pageTotal/pageSize >= 1"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="pageTotal"
        :current-page="currentPage"
        @current-change="handleCurrentChange">
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
  name: 'recordForTeacher',
  data () {
    return {
      tableData: [],
      codingRecords: [],
      pageTotal: 0,
      pageSize: 10,
      visible: false,
      code: '',
      uId: sessionStorage.getItem('id'),
      done: false,
      record: [],
      searchInput: '',
      currentPage: 1,
      sortType: 'id',
      sId: false,
      sMem: false,
      sTime: false,
      sDate: false
    }
  },
  async created () {
    this.getData(0, this.pageSize)
  },
  methods: {
    async getData (offset, limit) {
      this.pageTotal = await this.getListLength()
      // 默认显示从首页开始的10个条目
      // 获取对应的 quetions 数据
      if (this.pageTotal !== 0) {
        this.codingRecords = await this.getRecords(offset, limit)
        this.codingQuestions = await this.getQuestionById()
        this.stuInfos = await this.getStuInfoById()

        // console.log(this.codingRecords)
        // console.log(this.codingQuestions)
        console.log(this.stuInfos)
        // let merged = []

        this.codingRecords.forEach((record, index) => {
          let student = this.stuInfos.filter(stu => {
            return stu.id === record.uId
          })
          record.realName = student[0].realName
        })
        this.codingRecords.forEach((record, index) => {
          let question = this.codingQuestions.filter(quest => {
            return quest.id === record.cqId
          })
          record.topic = question[0].topic
        })
        console.log(this.codingRecords)
        this.tableData = this.codingRecords
      } else {
        this.tableData = []
      }
    },
    getListLength () {
      return new Promise((resolve, reject) => {
        this.$api.get('codingRecords/count', null, res => {
          resolve(res)
        }, res => {
          resolve(0)
        })
      })
    },
    getRecords (offset, limit) {
      return new Promise((resolve, reject) => {
        let data = {
          limit,
          offset
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingRecords', data, res => {
          // this.codingRecords = res
          resolve(res)
        }, res => { console.log('error:' + res) })
      })
    },
    checkCoding (row) {
      this.$alert('<PRE>' + row.code + '</PRE>', this.$t('common.recordForTeacher.checkCode'), {
        confirmButtonText: this.$t('common.recordForTeacher.ok'),
        dangerouslyUseHTMLString: true
      })
    },
    handleCurrentChange (val) {
      this.getData((val - 1) * this.pageSize, this.pageSize)
    },
    getQuestionById () {
      return new Promise((resolve, reject) => {
        let idArr = this.codingRecords.map(item => {
          return item.cqId
        })
        let data = {
          where: {
            id: idArr
          }
        }
        this.$api.get('codingQuestions', data, res => {
          resolve(res)
        }, res => {
          resolve(false)
        })
      })
    },
    getStuInfoById () {
      return new Promise((resolve, reject) => {
        let idArr = this.codingRecords.map(item => {
          return item.uId
        })
        console.log(idArr)
        let data = {
          where: {
            id: idArr
          }
        }
        this.$api.get('stuInfos', data, res => {
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
  }
}
</script>
<style scoped>
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