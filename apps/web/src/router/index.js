import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Auth Routes (public)
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../features/auth/components/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('../features/auth/views/LoginView.vue')
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('../features/auth/views/RegisterView.vue')
        },
        {
          path: 'forgot-password',
          name: 'forgotPassword',
          component: () => import('../features/auth/views/ForgotPasswordView.vue')
        }
      ]
    },

    // App Routes (protected) - Wrapped by MainLayout
    {
      path: '/',
      component: () => import('../features/shared/components/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../features/dashboard/views/Dashboard.vue')
        },
        {
          path: 'kanban',
          name: 'kanban',
          component: () => import('../features/kanban/views/KanbanBoard.vue')
        },
        {
          path: 'priority',
          name: 'priority',
          component: () => import('../features/priority/views/PriorityChart.vue')
        },
        {
          path: 'backlog',
          name: 'backlog',
          component: () => import('../features/backlog/views/BacklogView.vue')
        },
        {
          path: 'time-tracking',
          name: 'timeTracking',
          component: () => import('../features/timeTracking/views/TimeTrackingView.vue')
        },
        {
          path: 'analytics',
          name: 'analytics',
          component: () => import('../features/analytics/views/AnalyticsDashboard.vue')
        },
        {
          path: 'team',
          name: 'team',
          component: () => import('../features/team/views/TeamManagement.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../features/auth/views/ProfileView.vue')
        },
        {
          path: 'authorization',
          name: 'authorization',
          component: () => import('../features/auth/views/AuthorizationView.vue'),
          meta: { requiresRole: 'admin' }
        }
      ]
    },

    // Catch-all redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: '/auth/login'
    }
  ]
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.currentUser?.role

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth/login')
    return
  }

  // If route requires specific role
  if (to.meta.requiresRole && !authStore.hasRole(to.meta.requiresRole)) {
    next('/')
    return
  }

  // If user is authenticated and tries to access auth routes
  if (isAuthenticated && to.path.startsWith('/auth') && to.path !== '/auth/authorization') {
    next('/')
    return
  }

  next()
})

export default router
