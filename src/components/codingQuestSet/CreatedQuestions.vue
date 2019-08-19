<template>
  <div class="createQuestionsTable">
    <!-- 面包屑 -->
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-edit"></i>{{$t('common.createdQuestions.title')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 列表 -->
    <div class="createQuestionsContainer">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" :label="$t('common.createdQuestions.id')" width="50">
        </el-table-column>
        <el-table-column prop="topic" :label="$t('common.createdQuestions.topic')" width="450">
          <!-- <template slot-scope="scope">
            <el-button type="text" @click="selectQuestion(scope.row.id)">{{ scope.row.topic }}</el-button>
          </template> -->
        </el-table-column>
        <el-table-column :label="$t('common.createdQuestions.programLang')" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.programLang === 'js'" type="success" >{{ showTag(scope.row) }}</el-tag>
            <el-tag v-if="scope.row.programLang === 'cpp'" type="error" >{{ showTag(scope.row) }}</el-tag>
            <el-tag v-if="scope.row.programLang === 'c'" type="error" >{{ showTag(scope.row) }}</el-tag>
            <el-tag v-if="scope.row.programLang === 'java'" >{{ showTag(scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('common.createdQuestions.status')" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 'public'">Publicized</el-tag>
            <el-tag v-if="scope.row.status === 'edit'" type="warning">Editing</el-tag>
            <el-tag v-if="scope.row.status === 'close'" type="danger">Closed</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.createdQuestions.operate')">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit(scope.row.id)">{{$t('common.createdQuestions.edit')}}</el-button>
            <el-button type="primary" size="mini" @click="addTest(scope.row.id)">{{$t('common.createdQuestions.addTest')}}</el-button>
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
  name: 'CreatedQuestions',
  data () {
    return {
      tableData: [],
      pageTotal: 0,
      pageSize: 10,
      uId: sessionStorage.getItem('id')
    }
  },
  created () {
    this.getData()
  },
  methods: {
    async getData () {
      this.pageTotal = await this.getListLength()
      // 默认显示从首页开始的10个条目
      // 获取对应的 quetions 数据
      if (this.pageTotal !== 0) {
        this.tableData = await this.getQuestions(0, this.pageSize)
      } else {
        this.tableData = []
      }
    },
    getListLength () {
      return new Promise((resolve, reject) => {
        let data = {
          where: {
            uId: this.uId
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
          where: {
            uId: sessionStorage.getItem('id')
          },
          limit,
          offset
        }
        data.where = JSON.stringify(data.where)
        this.$api.get('codingQuestions', data, res => {
          this.tableData = res
        }, res => { console.log('error:' + res) })
      })
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