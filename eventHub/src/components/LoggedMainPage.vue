<template>
  <div>
    <LandingPage :isLoggedIn="isLoggedIn.value">
      <template v-slot:left-bar>
        <div class="left-bar">
          <div class="section" @click="handleClick('profile')">
            <i class="fas fa-user"></i>
            <span>My Profile</span>
          </div>
          <div class="section" @click="handleClick('events')">
            <i class="fas fa-calendar-alt"></i>
            <span>My Events</span>
          </div>
        </div>
      </template>
      <template v-slot:header>
        <div class="main-page-container">
          <div class="header-section card">
          <h1 class="title-section">Plan Your Events</h1>
          <span>Organize your upcoming events seamlessly</span>
          <button class="login-button create-btn">Create Event</button>
        </div>
        <div class="header-section card">
          <h1>Upcoming Events</h1>
          <div class="btn-header-container">
            <button class="header-filter">Today</button>
            <button class="header-filter">Tomorrow</button>
            <button class="header-filter">{{ username }}</button>
          </div>
        </div>
        </div>
      </template>
    </LandingPage>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import LandingPage from './LandingPage.vue'
import '@/assets/loggedMainPage.css'
import '@/assets/card.css'
import '@/assets/landingPage.css'

const username = ref('')
const isLoggedIn = inject('isLoggedIn')

const handleClick = (section) => {
  console.log(`Clicked on ${section}`);
}

onMounted(() => {
  try {
    const localUsername = localStorage.getItem('username')
    if (localUsername) {
      username.value = localUsername
    } else {
      throw new Error('Username not found in local storage')
    }
  } catch (error) {
    console.error(error)
  }
})
</script>
