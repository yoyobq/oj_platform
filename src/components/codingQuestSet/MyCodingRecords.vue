<template>
  <div class="codingQuestionTable">
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingRecord.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索框 -->
    <el-input :placeholder="$t('common.recordForTeacher.searchQuestion')" v-model.trim="searchInput" class="search-input" @change="questSearch"></el-input>
    <el-button icon="el-icon-search" @click="questSearch" type="primary"></el-button>

    <!-- 筛选标签 -->
    <el-row>
      <el-col :span="10" class="category-tags">
        <el-tag
          class="pt-tags"
          v-for="item in ptTags"
          :id = "item.pt"
          :key="item.label"
          :type="item.type"
          effect="dark"
          @click="tagClick">
          {{ item.label }}
        </el-tag>
      </el-col>
    </el-row>

    <!-- 题目列表 -->
    <div class="codingQuestionContainer">
      <el-table :data="tableData" class="quest-list" border empty-text="No Coding Questions"
                @row-click="selectQuestion" header-cell-class-name="quest-list-header">
        <el-table-column prop="id" :label="$t('common.codingQuestion.id')" width="50" align="center"></el-table-column>
        <el-table-column prop="topic" :label="$t('common.codingQuestion.topic')" header-align="center" >
          <template slot-scope="scope">
            <el-link :underline="false" type="success" @click="selectQuestion(scope.row.id)">{{ scope.row.topic }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="Subm times" prop="submitTimes" align="center" width="100"></el-table-column>
        <el-table-column label="Expire" align="center" width="100" :formatter="getExprie"></el-table-column>
        <el-table-column :label="$t('common.codingQuestion.programLang')" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.programLang === 'js'" type="success" >{{ showTag(scope.row) }}</el-tag>
            <el-tag v-if="scope.row.programLang === 'cpp'" type="error" >{{ showTag(scope.row) }}</el-tag>
            <el-tag v-if="scope.row.programLang === 'c'" type="error" >{{ showTag(scope.row) }}</el-tag>
            <el-tag v-if="scope.row.programLang === 'java'" >{{ showTag(scope.row) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页条 -->
    <el-pagination
      v-if=" pageTotal/pageSize >= 1"
      background
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="pageTotal">
    </el-pagination>
  </div>
</template>
<script>
export default{
  data () {
    return {
      tableData: [],
      questions: [],
      searchInput: '',
      pageTotal: 0,
      pageSize: 10,
      ptTags: [
        {pt: 'all', label: 'Show all', type: 'warning', typeSelected: 'warning'},
        {pt: 'js', label: 'Javascript', type: 'info', typeSelected: 'success'}, // success
        {pt: 'cpp', label: 'C++', type: 'info', typeSelected: 'danger'}, // danger
        {pt: 'c', label: 'C program', type: 'info', typeSelected: 'danger'}, // danger
        {pt: 'java', label: 'Java', type: 'info', typeSelected: ''} // ''
      ],
      ptShowList: ['js', 'cpp', 'c', 'java'],
      myQuestionsIdArr: [],
      uId: sessionStorage.getItem('id')
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      if (this.ptShowList.length === 0) {
        this.tableData = []
      } else {
        this.pageTotal = await this.getListLength()
        // 默认显示从首页开始的10个条目
        // getQuestions时有一个隐藏的参数，即ptShowList，请注意
        // 获取对应的 quetions 数据
        if (this.pageTotal !== 0) {
          this.questions = await this.getQuestions(0, this.pageSize)
          // 计算正确率，并赋值给表格
          // 由于callback地狱，不想一层层拿出来了，所以直接在函数中就赋值了
          // 最优的做法应该是return个结果，然后在此赋值
          this.getAccuracy()
          // this.tableData = await this.getAccuracy()
        } else {
          this.tableData = []
        }
      }
    },
    getListLength () {
      return new Promise((resolve, reject) => {
        let data = {
          where: {
            status: ['unsolved', 'done'],
            uId: this.uId
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingRecords', data, res => {
          this.myQuestionsIdArr = res.map(item => {
            return item.cqId
          })

          // 保险起见，防止测试时的后台错误，
          // 数组排序后去重，实际上，不应该出现重复数据
          this.myQuestionsIdArr = this.myQuestionsIdArr.sort()
          this.myQuestionsIdArr = [...new Set(this.myQuestionsIdArr)]

          resolve(res.length)
        }, res => {
          resolve(0)
        })
      })
    },
    getQuestions (offset, limit) {
      return new Promise((resolve, reject) => {
        let data = {
          limit,
          offset,
          where: {
            programLang: this.ptShowList,
            id: this.myQuestionsIdArr
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingQuestions', data, res => {
          resolve(res)
        }, res => {
          res = []
          resolve(res)
        })
      })
    },

    // 计算页面中出现各题的准确率
    getAccuracy () {
      let result = []
      // 获取页面中显示题目的id列
      this.questions.map(item => {
        result.push(item.id)
      })

      // 根据 id 列获取数据库中的 codingRecords 信息
      let data = {
        where: {
          uId: this.uId,
          cqId: result,
          status: ['unsolved', 'done']
        }
      }
      data.where = JSON.stringify(data.where)
      this.$api.get('codingRecords', data, res => {
        // 简化 codingRcords 信息，仅保留必要的列，并新增 finishTimes 用于记录完成次数
        res = res.map(item => {
          return {
            id: item.cqId,
            submitTimes: item.submitTimes,
            status: item.status,
            startDate: item.startDate,
            lastModiDate: item.lastModiDate,
            expireTime: item.expireTime
          }
        })
        // 按id 合并 题目及作题记录
        let merged = []
        let allArr = [this.questions, res]
        allArr.forEach(function (a) {
          a.forEach(function (b) {
            if (!this[b.id]) {
              this[b.id] = {}
              merged.push(this[b.id])
            }
            Object.keys(b).forEach(function (k) {
              this[b.id][k] = b[k]
            }, this)
          }, this)
        }, Object.create(null))
        // console.table(merged)
        this.tableData = merged
      }, res => {
        // 若没有查到任何作题的信息，当然题目显然是未做过
        this.tableData = this.questions
      })
    },
    async tagClick (e) {
      this.searchInput = ''
      let index = 0
      this.ptTags.forEach((item, idx) => {
        // console.log(item.pt, index)
        if (item.pt === e.target.id) {
          index = idx
        }
      })

      this.ptTags[index].type = this.ptTags[index].type === 'info' ? this.ptTags[index].typeSelected : 'info'
      if (index === 0 && this.ptTags[0].type !== 'info') {
        // 如果选中的是 all
        this.ptShowList = ['js', 'cpp', 'c', 'java']
        this.ptTags.forEach((item, idx) => {
          if (idx !== 0) {
            item.type = 'info'
          }
        })
      } else {
        // 如果选中的是其他
        this.ptTags[0].type = 'info'
        this.ptShowList = []
        this.ptTags.forEach((item, idx) => {
          if (idx !== 0 && item.type !== 'info') {
            this.ptShowList.push(item.pt)
          }
        })
      }
      this.getData()
    },
    questSearch () {
      let result = []
      if (this.searchInput.length !== 0 && this.searchInput !== null) {
        this.tableData.forEach((item) => {
          if (item.topic.indexOf(this.searchInput) !== -1) {
            result.push(item)
          }
        })
        this.tableData = result
      }
    },
    selectQuestion (id) {
      this.$router.push('/codingTest?id=' + id)
    },
    handleCurrentChange (val) {
      this.getQuestions((val - 1) * 10)
    },
    // handleClick (row) {
    //   console.log(row)
    // },
    getExprie (row) {
      // exprie 单位是分钟
      // console.log(row.expireTime, row.startDate)
      // console.log(this.$moment().format('X'))
      if (row.expireTime === 0) {
        return 'Unlimit'
      } else {
        const startTime = parseInt(this.$moment(row.startDate).valueOf() / 1000 / 60)
        let timestamp = (new Date()).valueOf()
        const nowTime = (parseInt(timestamp / 1000 / 60))
        const usedTime = nowTime - startTime
        if (usedTime > row.expireTime) {
          return 'Overdue'
        } else {
          console.log('exprie')
        }
      }
    },
    showTag (row) {
      switch (row.programLang) {
        case 'js':
          return 'Javascript'
        case 'cpp':
          return 'C++'
        case 'c':
          return 'C program'
        case 'java':
          return 'Java'
        default:
          return row.programLang
      }
    }
  },
  watch: {
    searchInput: async function (val) {
      if (val === '') {
        this.getData()
      }
    }
  }
}
</script>
<style scoped>
.category-tags {
  margin-bottom: 20px;
}
.codingQuestionContainer {
  width: 960px; 
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px
}
.search-input{
  width: 400px;
  /* float: right; */
  margin-bottom: 20px;
}
.quest-list {
  cursor: pointer;
}

.quest-list a {
  color: black;
}

.pt-tags {
  margin-left: 10px;
  cursor: pointer;
}
</style>

<style>
.quest-list-header {
  background-color: #242f42 !important;
  color: #ffffff;
  cursor: default;
}
</style>