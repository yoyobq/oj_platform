<template>
  <div class="dash-main">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-row>
            <el-col>
              <el-card shadow="hover" class="mgb20">
                <div class="user-info">
                  <img :src="avatarPic" class="user-avator" alt="">
                  <div class="user-info-cont">
                    <div class="user-info-name">{{ realName }}</div>
                    <div>{{className}}</div>
                  </div>
                </div>
                <div class="user-info-list">上次登录时间：<span>{{new Date(lastLoginTime).toLocaleString()}}</span></div>
                <div class="user-info-list">上次登录地址：<span>{{lastLoginIP}}</span></div>
              </el-card>
              <el-card shadow="hover" class="mgb20">
                <div slot="header" class="clearfix">
                  <span>学习进度</span>
                </div>
                网页设计
                <el-progress :percentage="14" color="#42b983"></el-progress>
                Liunx基础
                <el-progress :percentage="67" color="#f1e05a"></el-progress>
                省统考
                <el-progress :percentage="9"></el-progress>
              </el-card>
            </el-col>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-row :gutter="20" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
                <i class="el-icon-view grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">0</div>
                  <div>待办事项</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
                <i class="el-icon-message grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">2</div>
                  <div>消息</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
                <i class="el-icon-document grid-con-icon"></i>
                <div class="grid-cont-right">
                  <div class="grid-num">0</div>
                  <div>当前考试</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="hover" :body-style="{ height: '304px'}">
              <div slot="header" class="clearfix">
                <span>待办事项</span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
              </div>
              <el-table :data="eventList" :show-header="false" height="300" style="width: 100%;font-size:14px;" empty-text="幸苦了，你已经完成了所有任务，请明天再来看看">
                <el-table-column width="40">
                  <!--<template slot-scope="scope">
                    <el-checkbox></el-checkbox>
                  </template>-->
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope" >
                    <div  class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.exam_title}}</div>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-button type="success" size="mini" @click= "handleEdit(scope.$index, scope.row)">Start</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="hover" >
              <div slot="header" class="clearfix">
                <span>重要新闻</span>
                <el-table :data="newsList" :show-header="false" height="300" style="width: 100%;font-size:14px;" >
                </el-table>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">添加</el-button> -->
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: 'dashboard',
      data () {
        return {
          realName: localStorage.getItem('realName'),
          // localStorage.getItem('username')
          classId: localStorage.getItem('classId'),
          className: localStorage.getItem('className'),
          lastLoginTime: localStorage.getItem('lastLoginTime'),
          lastLoginIP: localStorage.getItem('lastLoginIp'),
          avatarPic: localStorage.getItem('avatarPath'),
          eventList: [],
          newsList: [],
          permission: [],
          event: {},
          questInfo: {},
          dialogTableVisible: false,
          id: sessionStorage.getItem('id'),
          isExamStart: false,
          isExamEnd: false,
          score: null
        }
      },
      created () {
        console.log(this.avatarPic)
      },
      methods: {
        // createRecord () {
        // 在scorelist中寻找对应考题
        // this.$api.get('api/v1/accounts/' + this.id + '/scoreLists/' + this.event.exam_id, null,
        //   res => {
        //     // 如果可以找到,判断是否已经交卷
        //     if (res.sco_SubmitTime === null) {
        //       // 未交卷
        //       sessionStorage.set('examid', this.event.exam_id)
        //       this.isExamStart = true
        //     } else {
        //       // 已交卷，显示得分
        //       this.isExamEnd = true
        //       if (res.sco_score === null) {
        //         this.score = 0
        //       } else {
        //         this.score = res.sco_score
        //       }
        //     }
        //   }, res => {
        //   // 如果找不到考试记录，则生成一场新的考试，先生成考题
        //     let data = {
        //       '_csrf': this.$cookies.getItem('csrfToken'),
        //       gid: this.questInfo.gid,
        //       num: this.questInfo.num,
        //       score: this.questInfo.score,
        //       id: this.id,
        //       examId: this.event.exam_id
        //     }
        //     // console.log(data)
        //     this.$api.post('api/v1/examRecords', data, res => {
        //     // 再生成考试记录
        //       let dataScoreList = {
        //         '_csrf': this.$cookies.get('csrfToken'),
        //         examId: this.event.exam_id
        //       }
        //       this.$api.post('api/v1/accounts/' + this.id + '/scoreLists/', dataScoreList, res => {
        //         if (res === 'Created') {
        //           sessionStorage.setItem('examid', this.event.exam_id)
        //         }
        //       }, res => {})
        //     })
        //   })
        // // console.log(data)
        // },
        // getExamList () {
        // 根据班级获取考试
        // let data = {
        //   // '_csrf': this.$cookies.get('csrfToken')
        // }
        // this.$api.get('api/v1/classes/' + this.classId + '/examLists', null, res => {
        //   this.eventList = res
        //   // console.log(res)
        // }, res => {
        //   console.log(res)
        // })
        // },
        // handleEdit (index, row) {
        //   // console.log(index)
        //   this.score = null
        //   this.isExamEnd = false
        //   this.isExamStart = false
        //   sessionStorage.setItem('examid', this.event.exam_id)
        //   this.event = row
        //   this.questInfo = JSON.parse(this.event.exam_questInfo)
        //   this.questInfo.type = '选择题'
        //   this.createRecord()
        //   this.dialogTableVisible = true
        // },
        // handelStart () {
        //   console.log(sessionStorage.getItem('examid'))
        //   this.$router.push('/Examine')
        // }
      },
      computed: {
      }
    }
</script>


<style scoped>
  .el-row {
      margin-bottom: 20px;
  }

  .grid-content {
      display: flex;
      align-items: center;
      height: 100px;
  }

  .grid-cont-right {
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: #999;
  }

  .grid-num {
      font-size: 30px;
      font-weight: bold;
  }

  .grid-con-icon {
      font-size: 50px;
      width: 100px;
      height: 100px;
      text-align: center;
      line-height: 100px;
      color: #fff;
  }

  .grid-con-1 .grid-con-icon {
      background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
      color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
      background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
      color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
      background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
      color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
      width: 120px;
      height: 120px;
      border-radius: 50%;
  }

  .user-info-cont {
      padding-left: 50px;
      flex: 1;
      font-size: 14px;
      color: #999;
  }

  .user-info-cont div:first-child {
      font-size: 30px;
      color: #222;
  }

  .user-info-list {
      font-size: 14px;
      color: #999;
      line-height: 25px;
  }

  .user-info-list span {
      margin-left: 30px;
  }

  .mgb20 {
      margin-bottom: 20px;
      min-width: 350px;
  }

  .todo-item {
      font-size: 14px;
  }

  .todo-item-del {
      text-decoration: line-through;
      color: #999;
  }

  .exam-info {
    font-size: 16px;
    font-weight: 500;
    padding-left: 30px;
  }
  
  .dash-main {
    min-width: 1200px;
  }
</style>
