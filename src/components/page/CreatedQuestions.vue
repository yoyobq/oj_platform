<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createdQuestions.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
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
        <el-table-column prop="status" label="状态">
        </el-table-column>
        <el-table-column label="操作">
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
    this.$api.get('codingQuestions', data, res => {
      this.tableData = res
    }, res => {})
  },
  methods: {
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
.container {
}
</style>