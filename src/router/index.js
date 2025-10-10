import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCache } from '@/composables/useCache'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import MigrateView from '@/views/MigrateView.vue'
import FollowersView from '@/views/logged/FollowersView.vue'
import FollowingView from '@/views/logged/FollowingView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserProfile from '@/views/logged/UserProfile.vue'
import NotificationsView from '@/views/logged/NotificationsView.vue'
import RedirectPostView from '@/views/logged/RedirectPostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:handle?/profile',
      name: 'profile',
      component: UserProfile,
      meta: { requiresAuth: true },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:handle?/followers',
      name: 'followers',
      component: FollowersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:handle?/following',
      name: 'following',
      component: FollowingView,
      meta: { requiresAuth: true },
    },
    {
      path: '/:handle/post/:postId',
      name: 'post',
      component: RedirectPostView,
      meta: { requiresAuth: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresAuth: true },
    },
    {
      path: '/migrate',
      name: 'migrate',
      component: MigrateView,
      meta: { requiresAuth: false },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const cache = useCache()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (authStore.accessToken && !authStore.jwtIsValid()) {
    authStore.logout()
    cache.clear()
  } else if (!authStore.accessToken) {
    authStore.checkSession()
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
