<template>
  <div class="createQuestionsTable">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createdQuestions.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="createQuestionsContainer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" :label="$t('common.createdQuestions.id')">
        </el-table-column>
        <el-table-column :label="$t('common.createdQuestions.topic')">
          <template slot-scope="scope">
            <el-button type="text" @click="selectQuestion(scope.row.id)">{{ scope.row.topic }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="programLang" :label="$t('common.createdQuestions.programLang')">
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.createdQuestions.status')">
        </el-table-column>
        <el-table-column :label="$t('common.createdQuestions.operate')">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row.id)">{{$t('common.createdQuestions.edit')}}</el-button>
            <el-button type="primary" size="mini" @click="addTest(scope.row.id)">{{$t('common.createdQuestions.addTest')}}</el-button>
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
      pageCount: 100
    }
  },
  created () {
    let data = {
      uId: sessionStorage.getItem('id')
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
        uId: sessionStorage.getItem('id'),
        limit: 10,
        offset: page
      }
      this.$api.get('codingQuestions', data, res => {
        for (let item of res) {
          switch (item.programLang) {
            case 'js':
              item.programLang = 'Javascript'
              break
            case 'cpp':
              item.programLang = 'c++'
              break
          }
        }
        this.tableData = res
      }, res => {})
    },
    selectQuestion (id) {
      this.$router.push('/codingTest?id=' + id)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    edit (id) {
      this.$router.push({
        name: 'createQuestion',
        params: {
          id: id
        },
        query: {
          type: 'edit'
        }
      })
    },
    addTest (id) {
      this.$router.push({
        name: 'addTest',
        params: {
          id: id
        }
      })
    }
  }
}
</script>
<style>
.createQuestionsContainer {
  width: 80%;
  padding: 30px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px
}
</style>