import { createRouter, createWebHistory } from 'vue-router'
import { useRoleStore } from '@/stores/role'

const routes = [
  {
    path: '/',
    redirect: '/role-select'
  },
  {
    path: '/role-select',
    name: 'RoleSelect',
    component: () => import('@/views/RoleSelect.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/admin/indicator-management',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'indicator-management',
        name: 'IndicatorManagement',
        component: () => import('@/views/admin/evaluation/IndicatorManagement.vue'),
        meta: { title: '评价指标管理' }
      },
      {
        path: 'indicator-detail/:type/:id',
        name: 'IndicatorDetail',
        component: () => import('@/views/admin/evaluation/IndicatorDetail.vue'),
        meta: { title: '指标详情' }
      },
      {
        path: 'rule-management',
        name: 'RuleManagement',
        component: () => import('@/views/admin/evaluation/RuleManagement.vue'),
        meta: { title: '评价规则管理' }
      },
      {
        path: 'task-management',
        name: 'TaskManagement',
        component: () => import('@/views/admin/task/TaskManagement.vue'),
        meta: { title: '评价任务管理' }
      },
      {
        path: 'task-detail/:id',
        name: 'TaskDetail',
        component: () => import('@/views/admin/task/TaskDetail.vue'),
        meta: { title: '任务详情' }
      },
      {
        path: 'score-dashboard',
        name: 'ScoreDashboard',
        component: () => import('@/views/admin/statistics/ScoreDashboard.vue'),
        meta: { title: '积分看板' }
      },
      {
        path: 'score-detail',
        name: 'ScoreDetail',
        component: () => import('@/views/admin/statistics/ScoreDetail.vue'),
        meta: { title: '积分明细' }
      },
      {
        path: 'appeal-handling',
        name: 'AppealHandling',
        component: () => import('@/views/admin/statistics/AppealHandling.vue'),
        meta: { title: '申诉处理' }
      },
      {
        path: 'notification',
        name: 'Notification',
        component: () => import('@/views/admin/notification/Notification.vue'),
        meta: { title: '系统通知' }
      },
      {
        path: 'material-approval',
        name: 'MaterialApproval',
        component: () => import('@/views/admin/material/MaterialApproval.vue'),
        meta: { title: '评价填报审批' }
      }
    ]
  },
  {
    path: '/teacher',
    name: 'Teacher',
    component: () => import('@/layouts/TeacherLayout.vue'),
    redirect: '/teacher/evaluation-projects',
    children: [
      {
        path: 'evaluation-projects',
        name: 'EvaluationProjects',
        component: () => import('@/views/teacher/EvaluationProjects.vue'),
        meta: { title: '评价项目' }
      },
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: () => import('@/views/teacher/Dashboard.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: () => import('@/views/teacher/Profile.vue'),
        meta: { title: '个人中心' }
      },
      {
        path: 'self-evaluation',
        name: 'SelfEvaluation',
        component: () => import('@/views/teacher/SelfEvaluation.vue'),
        meta: { title: '自我评价' }
      },
      {
        path: 'peer-review',
        name: 'PeerReview',
        component: () => import('@/views/teacher/PeerReview.vue'),
        meta: { title: '评审他人' }
      },
      {
        path: 'my-data',
        name: 'MyData',
        component: () => import('@/views/teacher/MyData.vue'),
        meta: { title: '个人数据' }
      },
      {
        path: 'messages',
        name: 'Messages',
        component: () => import('@/views/teacher/Messages.vue'),
        meta: { title: '消息中心' }
      },
      {
        path: 'evaluation-fill/:id',
        name: 'EvaluationFillDetail',
        component: () => import('@/views/teacher/EvaluationFillDetail.vue'),
        meta: { title: '填报详情' }
      },
      {
        path: 'indicator-fill/:taskId/:indicatorId',
        name: 'IndicatorFill',
        component: () => import('@/views/teacher/IndicatorFill.vue'),
        meta: { title: '指标填报' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const roleStore = useRoleStore()

  // 如果是角色选择页，直接放行
  if (to.path === '/role-select') {
    next()
    return
  }

  // 检查是否已选择角色
  if (!roleStore.currentRole) {
    next('/role-select')
    return
  }

  // 检查角色与路由是否匹配
  if (to.path.startsWith('/admin') && roleStore.currentRole !== 'admin') {
    next('/role-select')
    return
  }

  if (to.path.startsWith('/teacher') && roleStore.currentRole !== 'teacher') {
    next('/role-select')
    return
  }

  next()
})

export default router
