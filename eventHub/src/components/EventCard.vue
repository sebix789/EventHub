<template>
  <div>
    <LandingPage :isLoggedIn="isLoggedIn.value">
      <template v-slot:left-bar>
        <div class="left-bar">
          <div class="section" @click="handleClick('profile')">
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
            <div class="event-container">
              <div class="event-detail">
                <div class="image-event">
                  <img :src="getImageUrl(event.image)" alt="Event Image" />
                </div>
                <div class="source-info">
                  <span>{{ event.title }}</span>
                  <span>{{ formatDate(event.date) }}</span>
                  <h3>About</h3>
                  <p class="description">
                    {{ event.description }}
                  </p>
                </div>
              </div>
              <div class="location">
                <div class="map">tu bedzie mapa moze</div>
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
const showCreateEventForm = ref(false)
const isLoggedIn = inject('isLoggedIn')
const showNoEventsMessage = ref(false)

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

const handleClick = section => {
  console.log(`Clicked on ${section}`)
}

const handleCreateEvent = () => {
  showCreateEventForm.value = true
}

const handleClose = () => {
  showCreateEventForm.value = false
}

const fetchEventsByDate = async date => {
  try {
    let searchDate = new Date()

    switch (date) {
      case 'Today':
        searchDate = searchDate.toISOString().split('T')[0] // Dzisiejsza data
        break
      case 'Tomorrow':
        searchDate.setDate(searchDate.getDate() + 1)
        searchDate = searchDate.toISOString().split('T')[0] // Jutrzejsza data
        break
    }

    console.log('Search Date:', searchDate)

    const response = await axiosInstanceEvent.get(
      `/getEventsByDate/${searchDate}`,
      {
        params: {
          date: searchDate
        }
      }
    )

    events.value = response.data
    console.log(response.data) // Wyświetlenie odpowiedzi w konsoli
  } catch (error) {
    console.error('Error while fetching events:', error)
  }
}

const formatDate = date => {
  const eventDate = new Date(date)
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return eventDate.toLocaleDateString('en-GB', options) // Ustawienia regionalne dla formatu DD-MM-YYYY
}

const fetchEventsForThisWeek = async () => {
  try {
    const response = await axiosInstanceEvent.get('/getEventsThisWeek')
    events.value = response.data
    console.log(response.data) // Wyświetlenie odpowiedzi w konsoli
  } catch (error) {
    console.error('Error while fetching events:', error)
  }
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
