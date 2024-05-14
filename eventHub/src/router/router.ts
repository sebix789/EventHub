import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/components/LandingPage.vue'
import LoggedMainPage from '@/components/LoggedMainPage.vue'
import SignupCard from '@/components/SignupCard.vue'
import LoginCard from '@/components/LoginCard.vue'
import EventCard from '@/components/EventCard.vue'
import EditEvent from '@/components/EditEvent.vue'

import MyProfile from '@/components/MyProfile.vue'
import MyEvents from '@/components/MyEvents.vue'
import CreateEvent from '@/components/CreateEvent.vue'

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
    children: [
      { path: 'my-events', component: MyEvents },
      { path: 'create-event', component: CreateEvent },
      { path: 'my-profile', component: MyProfile },
      { path: 'edit-event', component: EditEvent }
    ],
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
  },
  {
    path: '/event/:id',
    name: 'EventCard',
    component: EventCard
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
