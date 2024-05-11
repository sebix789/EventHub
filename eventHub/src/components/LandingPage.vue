<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <div class="landing-page">
    <div class="top-app-bar">
        <router-link to="/" class="title">
            <img src="../assets/title.png" alt="EventHub" />
        </router-link>
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
        @click="redirectToLogin"
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
              <button class="header-filter" @click="fetchEventsByDate('Today')">
                Today
              </button>
              <button
                class="header-filter"
                @click="fetchEventsByDate('Tomorrow')"
              >
                Tomorrow
              </button>
              <button class="header-filter" @click="fetchEventsForThisWeek()">
                This week
              </button>
            </div>
          </transition>
        </slot>
        <div v-if="events.length > 0" class="events-container">
          <div class="events-container">
            <div v-for="event in events" :key="event._id" class="event-card">
              <h2>{{ event.title }}</h2>
              <p>Date:{{ formatDate(event.date) }}</p>
              <!-- Formatowanie daty przy użyciu metody formatDate -->
              <p>Location: {{ event.location }}</p>
              <p>Description: {{ event.description }}</p>
              <img :src="getImageUrl(event.image)" alt="Event Image" />
            </div>
          </div>
          <div
            v-if="showNoEventsMessage && events.length === 0"
            class="no-events-message"
          >
            No events to display.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginCard from './LoginCard.vue'
import SignupCard from './SignupCard.vue'
import '@/assets/landingPage.css'
import axios from 'axios'

const router = useRouter()

const searchQuery = ref('')
const login = ref(false)
const signup = ref(false)
const isLoggedIn = inject('isLoggedIn')
const events = ref([])

const props = defineProps({
  isLoggedIn: Boolean
})

const axiosInstanceEvent = axios.create({
  baseURL: 'http://localhost:5000/api/events'
})

onMounted(() => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
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

const redirectToLogin = () => {
  router.push('/login')
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
    return `data:image/jpeg;base64,${base64Image}`;
  }
  // Default image URL or placeholder if no image available
  return 'https://via.placeholder.com/150';
};
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
img{
  width: 150px;
}
</style>
