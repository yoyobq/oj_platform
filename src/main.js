import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
// import '../static/css/theme-green/index.css'; // 浅绿色主题
import 'font-awesome/css/font-awesome.css'
import '@babel/polyfill' // ie8兼容
// import apiv1 from './api/v1.js'
import apiv2 from './api/v2.js'
import mjson from './api/mjson.js'
import VueCookies from 'vue-cookies'
import VueI18n from 'vue-i18n' // 国际化插件
// import Crypto from 'crypto'
import Moment from 'moment'
import VueCodeMirror from 'vue-codemirror-lite'
Vue.use(VueCodeMirror)

// Vue.use(apiv1)
// Vue.prototype.$apiv1 = apiv1
Vue.use(apiv2)
Vue.prototype.$api = apiv2
Vue.use(mjson)
Vue.prototype.$mjson = mjson
Vue.use(VueCookies)

// Vue.use(VueCookies)
Vue.use(ElementUI, { size: 'small' })
Vue.use(VueI18n)
// Vue.use(Crypto)
Vue.prototype.$moment = Moment
// Vue.prototype.$axios = axios

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  let permission = JSON.parse(sessionStorage.getItem('permission'))
  // 获取页面的权限
  // console.log(permission)
  // console.log(to.meta.needLogin)
  // 若是注册登录页面，无须验证session
  if (permission === null && to.meta.needLogin === false) {
    next()
  // 否则验证session中的permission是否存在，不存在就去登录页面
  } else if (permission === null) {
    next('/login')
  // permission存在但目的地是login，没有意义，强制去主页
  } else if (to.path === '/login') {
    next('/')
  // 排除了所有不需要检测permission的情况后，进行权限的检查
  } else {
    let pagePermission = permission[to.path.substr(1)]
    // console.log(pagePermission)
    // 如果权限允许
    if (pagePermission === 'execute' || pagePermission === 'read') {
      // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
      if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
        Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
          confirmButtonText: '确定'
        })
        router.go(-1)
      } else {
        // 访问目标页面
        next()
      }
    } else {
      // console.log(to.path)
      Vue.prototype.$alert('您没有访问目标组件或页面的权限，本次访问已被记录', '非法访问', {
        confirmButtonText: '确定'
      })
      router.go(0)
    }
  }
})

// 注册i18n实例，并引入语言文件
const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'en',
  messages: {
    'zh': require('./assets/languages/zh.json'),
    'en': require('./assets/languages/en.json')
  }
})

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')
