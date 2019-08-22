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
      <!-- <el-checkbox v-model="done" style="margin-left:20px;">{{$t('common.recordForTeacher.onlyDone')}}</el-checkbox> -->
      <el-input :placeholder="$t('common.recordForTeacher.searchQuestion')" v-model="searchInput" class="search-bar input-with-select">
        <el-select v-model="selectType" slot="prepend" class="search-type">
          <el-option label="Name" value="1"></el-option>
          <el-option label="Topic" value="2"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search"  @click="search"></el-button>
      </el-input>
      <div>
        <el-tag
          class="tag-bar"
          v-if="nameTag !== null"
          closable
          type="success"
          @close='deleteNameTag'>
          {{nameTag}}
        </el-tag>
        <el-tag
          class="tag-bar"
          v-if="topicTag !== null"
          closable
          @close='deleteTopicTag'>
          {{topicTag}}
        </el-tag>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="id" :label="$t('common.recordForTeacher.crId')" width="70" sortable></el-table-column>
        <el-table-column prop="realName" :label="$t('common.recordForTeacher.realName')" width="100"></el-table-column>
        <el-table-column prop="topic" :label="$t('common.recordForTeacher.topic')" width="300"></el-table-column>
        <!-- 内存使用 -->
        <el-table-column prop="memUsage" :label="$t('common.recordForTeacher.mem')" width="80"></el-table-column>
        <!-- 时间使用 -->
        <el-table-column prop="timeUsage" :label="$t('common.recordForTeacher.time')" width="80"></el-table-column>
        <!-- 解决日期 -->
        <el-table-column :label="$t('common.recordForTeacher.date')" width="100" :formatter="formatDate"></el-table-column>
        <!-- 解题状态 -->
        <el-table-column prop="status" :label="$t('common.recordForTeacher.status')" align="center" width="100" sortable>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'done'" type="success">Solved</el-tag>
            <el-tag v-if="scope.row.status === 'unsolved'" type="warning">Unsolved</el-tag>
            <el-tag v-if="scope.row.status === 'timeout'" type="danger">Timeout</el-tag>
            <el-tag v-if="scope.row.status === 'ignore'" type="danger">Ignore</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="status" :label="$t('common.recordForTeacher.status')"></el-table-column> -->
        <!-- 操作按钮 -->
        <el-table-column :label="$t('common.recordForTeacher.operate')">
          <template slot-scope="scope">
            <el-button size="mini" @click="checkCoding(scope.row)">{{$t('common.recordForTeacher.checkCode')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        hide-on-single-page
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="pageTotal"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
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
      selectType: '1',
      searchInput: '',
      searchCondition: {
        status: ['done', 'unsolved', 'timeout']
      },
      nameTag: null,
      topicTag: null
      // rules: {
      //   searchInput: [
      //     { required: true, message: this.$t('message.loginPage.inputName'), trigger: 'blur' }
      //   ]
      // }
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
        // console.log(this.codingRecords)
        this.tableData = this.codingRecords
      } else {
        this.tableData = []
      }
    },
    getListLength () {
      return new Promise((resolve, reject) => {
        let data = {
          where: this.searchCondition
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingRecords/count', data, res => {
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
          offset,
          where: this.searchCondition
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
        // console.log(idArr)
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
    handleCurrentChange (val) {
      this.getData((val - 1) * this.pageSize, this.pageSize)
    },
    deleteNameTag (ev) {
      this.nameTag = null
      delete this.searchCondition.uId
      this.getData(0, this.pageSize)
    },
    deleteTopicTag (ev) {
      this.topicTag = null
      delete this.searchCondition.cqId
      this.getData(0, this.pageSize)
    },
    formatDate (row) {
      if (row.status === 'done') {
        return this.$moment(Date.parse(row.solveDate)).format('MM-DD HH:MM')
      } else {
        return 'Unsolved'
      }
    },
    searchIdByName (name) {
      return new Promise((resolve, reject) => {
        let data = {
          where: {
            realName: name
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('stuInfos', data, res => {
          resolve(res)
        }, res => {
          console.log(res)
          resolve(null)
        })
      })
    },
    searchIdByTopic (topic) {
      return new Promise((resolve, reject) => {
        let data = {
          where: {
            topic: topic
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingQuestions', data, res => {
          resolve(res)
        }, res => {
          console.log(res)
          resolve(null)
        })
      })
    },
    async search () {
      // console.log('hi')
      if (this.searchInput) {
        if (this.selectType === '1') {
          let users = await this.searchIdByName(this.searchInput)
          if (users) {
            let result = users.map(item => {
              return item.id
            })
            this.searchCondition.uId = result
            this.nameTag = this.searchInput
          } else {
            this.$message({
              message: 'No data.',
              type: 'warning'
            })
          }
        }

        if (this.selectType === '2') {
          let questions = await this.searchIdByTopic(this.searchInput)
          if (questions) {
            let result = questions.map(item => {
              return item.id
            })
            this.searchCondition.cqId = result
            this.topicTag = this.searchInput
          } else {
            this.$message({
              message: 'No data.',
              type: 'warning'
            })
          }
        }
        this.getData(0, this.pageSize)
      } else {
        this.$message({
          message: 'The KEYWORD cannot be empty.',
          type: 'warning'
        })
      }
    }
  }
}
</script>
<style scoped>
.codingRecordContainer {
  width: 960px;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px
}
.search-bar{
  width: 500px;
  margin-bottom: 10px;
}

.search-type {
  width: 100px;
}

.tag-bar {
  margin-right: 10px;
  margin-bottom: 10px;
}

/* el-select el-select--small {
  width: 100px;
} */
</style>