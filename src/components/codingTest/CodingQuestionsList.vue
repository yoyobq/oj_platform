<template>
  <div class="codingQuestionTable">
    <!-- 面包屑 -->
    <!-- <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.codingQuestion.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->

    <!-- 搜索框 -->
    <div class="search-box">
      <el-input :placeholder="$t('common.recordForTeacher.searchQuestion')" v-model.trim="searchInput" class="search-input" @change="questSearch"></el-input>
      <el-button icon="el-icon-search" @click="questSearch" type="primary"></el-button>
    </div>
    <!-- 筛选标签 -->
    <el-row class="category-tags">
      <el-col :span="10">
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
        <el-table-column :label="$t('common.codingQuestion.topic')" header-align="center" >
          <template slot-scope="scope">
            <el-link :underline="false" type="success" >{{ scope.row.topic }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="Accuracy" align="center" width="100" :formatter="formatAccuracy"></el-table-column>
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
import bus from '../common/bus'
// import { setTimeout } from 'timers'
export default{
  name: 'CodingQuestionsList',
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
      ptShowList: ['js', 'cpp', 'c', 'java']
    }
  },
  created () {
    this.getData()
  },
  beforeDestroy () {
    console.log('before Dest')
    // bus.$emit('cqId', event.id)
  },
  methods: {
    async getData () {
      if (this.ptShowList.length === 0) {
        this.tableData = []
      } else {
        this.pageTotal = await this.getListLength()
        // 默认显示从首页开始的10个条目
        // getQuestions时有一个隐藏的参数，即ptShowList，请注意
        // console.log(this.ptShowList)
        // console.log(this.pageTotal)
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
            status: 'public',
            programLang: this.ptShowList
          }
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingQuestions/count', data, res => {
          resolve(res)
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
            status: 'public',
            programLang: this.ptShowList
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
          cqId: result,
          status: ['unsolved', 'done']
        }
      }
      data.where = JSON.stringify(data.where)
      this.$api.get('codingRecords', data, res => {
        // 简化 codingRcords 信息，仅保留必要的列，并新增 finishTimes 用于记录完成次数
        res = res.map(item => {
          return { cqId: item.cqId, submitTimes: item.submitTimes, status: item.status, finishTimes: 0 }
        })

        // 计算总的 submitTimes 和 finishTimes 并合并 cqId 一致的项
        for (var j = 0; j < res.length; j++) {
          // console.log(res)
          for (var i = res.length - 1; i > j; --i) {
            // console.log(res[j], res[i])
            if (res[j].cqId === res[i].cqId) {
              res[j].submitTimes += res[i].submitTimes
              if (res[i].status === 'done') {
                res[j].finishTimes++
              }
              res.splice(i, 1)
            }
            if (res[j].status === 'done') {
              res[j].finishTimes++
            }
          }
        }

        // 再次简化 codingRecods 信息，仅保留 cqId as id  , 并计算 Accuracy
        res = res.map(item => {
          return { id: item.cqId, accuracy: item.finishTimes === 0 ? 0 : item.finishTimes / item.submitTimes }
        })

        // console.table(this.questions)
        // console.table(res)

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
    selectQuestion (event) {
      console.log('selected')
      this.$router.push('/codingTest')
      setTimeout(() => {
        console.log('timeout')
        bus.$emit('cqId', event.id)
      }, 500)
      // bus.$emit('cqId', event.id)
    },
    handleCurrentChange (val) {
      this.getQuestions((val - 1) * this.pageSize, this.pageSize)
    },
    // handleClick (row) {
    //   console.log(row)
    // },
    formatAccuracy (row) {
      return row.accuracy === undefined || row.accuracy === 0 ? 'no data' : (row.accuracy * 100).toFixed(2) + '%'
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
.search-box {
  min-width: 500px;
}
.category-tags {
  margin-bottom: 20px;
  min-width: 860px;
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