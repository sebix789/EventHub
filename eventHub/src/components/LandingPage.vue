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
        />
        <i @click="handleSearch" class="fas fa-search search-icon"></i>
      </div>

      <button @click="toggleLogin" class="login-button">Log in</button>
    </div>
    <transition name="slide-fade" mode="out-in">
      <component
        v-if="currentView"
        :is="currentView"
        :key="currentViewKey"
        @close="handleClose"
        @switch-card="handleSwitch"
      />
      <h2 v-else class="header">Welcome to EventHub</h2>
    </transition>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import LoginCard from './LoginCard.vue'
import SignupCard from './SignupCard.vue'
import '@/assets/landingPage.css'

export default defineComponent({
  name: 'LandingPage',
  components: { LoginCard, SignupCard },
  setup() {
    const searchQuery = ref('')
    const login = ref(false)
    const signup = ref(false)

    const handleSearch = () => {
      alert(`Searching for: ${searchQuery.value}`)
    }

    const toggleSingup = () => {
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

    return {
      searchQuery,
      login,
      signup,
      handleSearch,
      toggleLogin,
      toggleSingup,
      handleSwitch,
      currentView,
      currentViewKey,
      handleClose
    }
  }
})
</script>
