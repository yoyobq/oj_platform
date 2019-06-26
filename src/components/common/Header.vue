<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">CSSE ONLINE JUDGE</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="isFullScreen()" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator"><img :src="avatarPic"></div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ realname }} <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item command="name">{{ username }}</el-dropdown-item> -->
                        <el-dropdown-item command="personal">{{$t('common.mainPage.personal')}}</el-dropdown-item>
                        <el-dropdown-item command="language">{{$t('common.mainPage.language')}}</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">{{$t('common.mainPage.logout')}}</el-dropdown-item> 
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus'
export default {
  data () {
    return {
      collapse: false,
      fullscreen: false,
      avatarPic: '',
      message: 2
    }
  },
  async created () {
    this.avatarPic = localStorage.getItem('avatarPath')
    console.log(this.avatarPic)
  },
  computed: {
    username () {
      let username = localStorage.getItem('username')
      return username || 'GUEST'
    },
    realname () {
      let realname = localStorage.getItem('realName')
      return realname || 'GUEST'
    }
  },
  methods: {
    isFullScreen () {
      if (this.fullscreen) {
        return this.$t('common.mainPage.cancelFull')
      } else {
        // console.log(this.$t('common.mainPage.cancelFull'))
        return this.$t('common.mainPage.fullScreen')
      }
    },
    // 用户名下拉菜单选择事件
    handleCommand (command) {
      if (command === 'loginout') {
        sessionStorage.clear()
        localStorage.clear()
        this.$router.push('/login')
      }
      if (command === 'personal') {
        this.$router.push('/personal')
      }
      if (command === 'language') {
        let lang = this.$i18n.locale
        if (lang === 'en') {
          localStorage.setItem('locale', 'zh')
          this.$i18n.locale = localStorage.getItem('locale')
          this.$message({
            message: '切换为中文！',
            type: 'success'
          })
        } else if (lang === 'zh') {
          localStorage.setItem('locale', 'en')
          this.$i18n.locale = localStorage.getItem('locale')
          this.$message({
            message: 'Switch to English!',
            type: 'success'
          })
        }
      }
    },
    // 侧边栏折叠
    collapseChage () {
      this.collapse = !this.collapse
      bus.$emit('collapse', this.collapse)
    },
    // 全屏事件
    handleFullScreen () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    }
  },
  mounted () {
    if (document.body.clientWidth < 1440) {
      this.collapseChage()
    }
  }
}
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        color: #fff;
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 70px;
    }
    .header .logo{
        float: left;
        width:400px;
        line-height: 70px;
    }
    .header-right{
        float: right;
        padding-right: 50px;
    }
    .header-user-con{
        display: flex;
        height: 70px;
        align-items: center;
    }
    .btn-fullscreen{
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }
    .btn-bell, .btn-fullscreen{
        position: relative;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 15px;
        cursor: pointer;
    }
    .btn-bell-badge{
        position: absolute;
        right: 0;
        top: -2px;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background: #f56c6c;
        color: #fff;
    }
    .btn-bell .el-icon-bell{
        color: #fff;
    }
    .user-name{
        margin-left: 10px;
    }
    .user-avator{
        margin-left: 20px;
    }
    .user-avator img{
        display: block;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-link{
        color: #fff;
        cursor: pointer;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
