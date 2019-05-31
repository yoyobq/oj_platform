import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '框架' },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/Dashboard.vue'], resolve),
          meta: { title: '平台首页' }
        },
        {
          path: '/personal',
          component: resolve => require(['../components/page/Personal.vue'], resolve),
          meta: { title: '个人设置' }
        },
        {
          path: '/codingQuestion',
          component: resolve => require(['../components/page/CodingQuestion.vue'], resolve),
          meta: { title: '编程题列表' }
        },
        {
          path: '/codingTest',
          component: resolve => require(['../components/page/CodingTest.vue'], resolve),
          meta: { title: '编程测试' }
        },
        {
          path: '/codingRecord',
          component: resolve => require(['../components/page/CodingRecord.vue'], resolve),
          meta: { title: '答题汇总' }
        },
        {
          path: '/addTest',
          name: 'addTest',
          component: resolve => require(['../components/page/AddTest.vue'], resolve),
          meta: { title: '添加测试代码' }
        },
        {
          path: '/createQuestion',
          name: 'createQuestion',
          component: resolve => require(['../components/page/CreateQuestion.vue'], resolve),
          meta: { title: '新建编程题' }
        },
        {
          path: '/createdQuestions',
          component: resolve => require(['../components/page/CreatedQuestions.vue'], resolve),
          meta: { title: '已创建题目' }
        },
        {
          path: '/module',
          component: resolve => require(['../components/page/Module.vue'], resolve),
          meta: { title: 'Overview' }
          // children: [
          //   {
          //     path: '/editModule',
          //     component: resolve => require(['../components/module/editModule.vue'], resolve)
          //   // meta: { title: '课程总览' },
          //   }
          // ]
        },
        {
          path: '/messages',
          component: resolve => require(['../components/page/Messages.vue'], resolve),
          meta: { title: '站内消息' }
        },
        {
          path: '/users',
          component: resolve => require(['../components/page/Users.vue'], resolve),
          meta: { title: 'Users', permission: true }
        },
        {
          // 题库一览
          path: '/questLibList',
          component: resolve => require(['../components/page/QuestLibList.vue'], resolve),
          meta: { title: '题库一览', keepAlive: false }
        },
        {
          path: '/exercise',
          name: 'exercise',
          component: resolve => require(['../components/page/Exercise.vue'], resolve),
          meta: { title: '题库练习', keepAlive: false }
        },
        {
          // 拖拽列表组件
          path: '/selfExam',
          component: resolve => require(['../components/page/SelfExam.vue'], resolve),
          meta: { title: '自考自测', keepAlive: false }
        },
        // {
        //   path: '/table',
        //   component: resolve => require(['../components/page/BaseTable.vue'], resolve),
        //   meta: { title: '基础表格' }
        // },
        {
          path: '/tabs',
          component: resolve => require(['../components/page/Tabs.vue'], resolve),
          meta: { title: 'Messages' }
        },
        {
          path: '/form',
          component: resolve => require(['../components/page/BaseForm.vue'], resolve),
          meta: { title: '基本表单' }
        },
        {
          // 富文本编辑器组件
          path: '/editor',
          component: resolve => require(['../components/page/VueEditor.vue'], resolve),
          meta: { title: '富文本编辑器' }
        },
        {
          // markdown组件
          path: '/markdown',
          component: resolve => require(['../components/page/Markdown.vue'], resolve),
          meta: { title: 'markdown编辑器' }
        },
        {
          // 图片上传组件
          path: '/upload',
          component: resolve => require(['../components/page/Upload.vue'], resolve),
          meta: { title: '文件上传' }
        },
        // {
        //   // vue-schart组件
        //   path: '/charts',
        //   component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
        //   meta: { title: 'schart图表' }
        // },
        {
          // vue-schart组件
          path: '/charts',
          component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
          meta: { title: '成绩分析' }
        },

        // {
        //   // 拖拽列表组件
        //   path: '/drag',
        //   component: resolve => require(['../components/page/DragList.vue'], resolve),
        //   meta: { title: '拖拽列表' }
        // },
        {
          // 权限页面
          path: '/permission',
          component: resolve => require(['../components/page/Permission.vue'], resolve),
          meta: { title: '权限测试', permission: true }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
      meta: { allowBack: false, needLogin: false }
    },
    // {
    //   path: '/signUpByMail',
    //   component: resolve => require(['../components/signUp/byMail.vue'], resolve),
    //   meta: { allowBack: false }
    // },
    // {
    //   path: '/signUpbyAccount',
    //   component: resolve => require(['../components/signUp/byAccount.vue'], resolve),
    //   meta: { allowBack: false }
    // },
    {
      path: '/signUpByIdentity',
      component: resolve => require(['../components/signUp/byIdentity.vue'], resolve),
      meta: { allowBack: false, needLogin: false }
    },
    {
      path: '/examine',
      component: resolve => require(['../components/page/Examine.vue'], resolve),
      meta: { allowBack: false }
    },
    {
      path: '/404',
      component: resolve => require(['../components/page/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../components/page/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
