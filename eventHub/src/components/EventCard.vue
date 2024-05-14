<template>
  <div>
    <LandingPage :isLoggedIn="isLoggedIn.value">
      <template v-slot:left-bar>
        <div class="left-bar">
          <div class="section" @click="handleProfile">
            <i class="fas fa-user"></i>
            <span>My Profile</span>
          </div>
          <div class="section" @click="handleEvent">
            <i class="fas fa-calendar-alt"></i>
            <span>My Events</span>
          </div>
        </div>
      </template>
      <template v-slot:header>
        <div v-if="event != null" class="main-page-container">
          <div class="card">
            <h1 class="">{{ event.title }}</h1>
            <div class="event-container-event">
              <div class="event-detail">
                <div class="event-image">
                  <img :src="getImageUrl(event.image)" alt="Event Image" />
                </div>
                <div class="event-info">
                  <span>{{ event.title }}</span>
                  <div>
                    <span>{{ formatDate(event.date) }}</span>
                  </div>
                  <h3>About</h3>
                  <p>
                    {{ event.description }}
                  </p>
                </div>
              </div>
              <div class="event-location">
                <div class="event-map">
                  <img
                    src="https://mt1.google.com/vt/lyrs=r&x=9100&y=5553&z=14"
                    alt=""
                  />
                </div>
                <div class="event-info-event">
                  <button @click="handleEdit">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </LandingPage>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import LandingPage from './LandingPage.vue'

import '@/assets/loggedMainPage.css'
import '@/assets/card.css'
import '@/assets/landingPage.css'
import '@/assets/eventCard.css'
import router from '@/router/router'

const event = ref(null)
const username = ref('')
const isLoggedIn = inject('isLoggedIn')

const axiosGetMyEvents = axios.create({
  baseURL: 'http://localhost:5000/api/events/'
})

onMounted(async () => {
  const localUsername = localStorage.getItem('username')
  if (localUsername) {
    username.value = localUsername
    const response = await axiosGetMyEvents.get(`getEvents/${username.value}`)
    const events = response.data
    event.value = events.find(
      ({ _id }) => _id === router.currentRoute['_value'].params.id
    )
  }
})

const handleProfile = section => {
  router.push('/logged-main-page/my-profile')
}

const handleEvent = () => {
  router.push('/logged-main-page/my-events')
}

const handleEdit = section => {
  router.push('/logged-main-page/edit-event')
}

const handleClick = section => {
  console.log(`Clicked on ${section}`)
}

const formatDate = date => {
  const eventDate = new Date(date)
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return eventDate.toLocaleDateString('en-GB', options) // Ustawienia regionalne dla formatu DD-MM-YYYY
}

const getImageUrl = base64Image => {
  if (base64Image) {
    return `data:image/jpeg;base64,${base64Image}`
  }
  // Default image URL or placeholder if no image available
  return 'https://via.placeholder.com/150'
}
</script>

<style>
/* Style dla wydarzeń */
.events-container {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
}

.event-card {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

/* Styl dla komunikatu o braku wydarzeń */
.no-events-message {
  margin-top: 20px;
  font-weight: bold;
  color: red;
}
img {
  width: 150px;
}
</style>
