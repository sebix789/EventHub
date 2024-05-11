import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import LoggedMainPage from '@/components/LoggedMainPage.vue'
import SignupCard from '@/components/SignupCard.vue'
import LoginCard from '@/components/LoginCard.vue'

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/logged-main-page',
    name: 'LoggedMainPage',
    component: LoggedMainPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/singup',
    name: 'SingupCard',
    component: SignupCard
  },
  {
    path: '/login',
    name: 'LoginCard',
    component: LoginCard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // check if user is authenticated
    if (!localStorage.getItem('token')) {
      next({ name: 'Login' }) // redirect to login page
    } else {
      next() // proceed to route
    }
  } else {
    next() // proceed to route
  }
})

export default router
