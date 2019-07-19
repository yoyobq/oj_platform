import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'codingQuestionsList'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: { title: '框架' },
      children: [
        {
          path: '/personal',
          name: 'personal',
          component: resolve => require(['../components/page/Personal.vue'], resolve),
          meta: { title: '个人设置' }
        },
        {
          path: '/codingQuestionsList',
          name: 'codingQuestionsList',
          component: resolve => require(['../components/codingTest/CodingQuestionsList.vue'], resolve),
          meta: { title: '浏览题目' }
        },
        {
          path: '/codingTest',
          component: resolve => require(['../components/codingTest/CodingTest.vue'], resolve),
          meta: { title: '编程测试' }
        },
        {
          path: '/myCodingRecords',
          name: 'myCodingRecords',
          component: resolve => require(['../components/codingQuestSet/MyCodingRecords.vue'], resolve),
          meta: { title: '我的题目' }
        },
        {
          path: '/addTest',
          name: 'addTest',
          component: resolve => require(['../components/codingQuestSet/AddTest.vue'], resolve),
          meta: { title: '测试用例' }
        },
        {
          path: '/createQuestion',
          name: 'createQuestion',
          component: resolve => require(['../components/codingQuestSet/CreateQuestion.vue'], resolve),
          meta: { title: '新建题目' }
        },
        {
          path: '/createdQuestions',
          component: resolve => require(['../components/codingQuestSet/CreatedQuestions.vue'], resolve),
          meta: { title: '已建题目' }
        },
        {
          path: 'recordForTeacher',
          component: resolve => require(['../components/codingQuestSet/RecordForTeacher.vue'], resolve),
          meta: {title: '查看学生记录'}
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve),
      meta: { allowBack: false, needLogin: false }
    },
    {
      path: '/signUpByIdentity',
      component: resolve => require(['../components/signUp/byMail.vue'], resolve),
      meta: { allowBack: false, needLogin: false }
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
