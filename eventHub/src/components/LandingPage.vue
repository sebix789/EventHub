<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <div class="landing-page">
    <div class="top-app-bar">
      <div class="title">
        <img src="../assets/title.png" alt="EventHub" />
      </div>
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search for events"
          v-model="searchQuery"
        />
        <i @click="handleSearch" class="fas fa-search search-icon"></i>
      </div>
      <button
        v-if="!isLoggedIn"
        :isLoggedIn="isLoggedIn"
        @click="toggleLogin"
        class="login-button"
      >
        Log in
      </button>
      <button v-else @click="logout" class="login-button">Logout</button>
    </div>
    <div class="main-container">
      <div class="left-bar-container">
      <slot name="left-bar"></slot>
    </div>
    <div class="header-container">
      <slot name="header">
        <transition name="slide-fade" mode="out-in">
          <component
            v-if="currentView"
            :is="currentView"
            :key="currentViewKey"
            @close="handleClose"
            @switch-card="handleSwitch"
          />
          <div v-else class="header header-wrapper">
            <h2 class="header">Welcome to EventHub</h2>
            <button class="header-filter">Today</button>
            <button class="header-filter">Tomorrow</button>
            <button class="header-filter">This week</button>
          </div>
        </transition>
      </slot>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import LoginCard from './LoginCard.vue'
import SignupCard from './SignupCard.vue'
import '@/assets/landingPage.css'

const router = useRouter()

const searchQuery = ref('')
const login = ref(false)
const signup = ref(false)
const isLoggedIn = inject('isLoggedIn')

const props = defineProps({
  isLoggedIn: Boolean
})

const handleSearch = () => {
  alert(`Searching for: ${searchQuery.value}`)
}

const toggleSignup = () => {
  signup.value = !signup.value
}

const toggleLogin = () => {
  login.value = !login.value
}

const handleSwitch = () => {
  if (login.value) {
    login.value = false
    signup.value = true
  } else if (signup.value) {
    login.value = true
    signup.value = false
  }
}

const handleClose = () => {
  login.value = false
  signup.value = false
}

const currentView = computed(() => {
  if (login.value) return LoginCard
  if (signup.value) return SignupCard
  return null
})

const currentViewKey = computed(() => {
  return login.value ? 'login' : signup.value ? 'signup' : 'none'
})

const logout = () => {
  isLoggedIn.value = false
  // Remove the token from local storage and reload the page
  localStorage.removeItem('token')
  router.push({ name: 'LandingPage' })
}
</script>
