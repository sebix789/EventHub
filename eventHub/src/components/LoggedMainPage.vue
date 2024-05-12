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
        <div class="main-page-container">
          <div
            v-if="!showCreateEventForm && !showMyEvents"
            class="header-section card"
          >
            <h1 class="title-section">Plan Your Events</h1>
            <span>Organize your upcoming events seamlessly</span>
            <button class="login-button create-btn" @click="handleCreateEvent">
              Create Event
            </button>
          </div>
          <MyEvents
            v-else-if="showMyEvents && !showCreateEventForm"
            @close="handleClose"
          />
          <CreateEvent
            class="header-section card"
            v-else-if="showCreateEventForm && !showMyEvents"
            @close="handleClose"
          />
          <div class="header-section card">
            <h1>Upcoming Events</h1>
            <div class="btn-header-container">
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
                This Week
              </button>
            </div>
          </div>
          <!-- Dodaj sekcję na wyświetlanie wydarzeń -->
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
      </template>
    </LandingPage>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LandingPage from './LandingPage.vue'
import CreateEvent from './CreateEvent.vue'
import '@/assets/loggedMainPage.css'
import '@/assets/card.css'
import '@/assets/landingPage.css'
import MyEvents from './MyEvents.vue'

const router = useRouter()

const username = ref('')
const showCreateEventForm = ref(false)
const isLoggedIn = inject('isLoggedIn')
const events = ref([]) // Nowa zmienna reaktywna na wydarzenia
const showNoEventsMessage = ref(false) // Flaga dla komunikatu o braku wydarzeń

const axiosInstanceEvent = axios.create({
  baseURL: 'http://localhost:5000/api/events'
})
const showMyEvents = ref(false)

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

const handleClick = section => {
  console.log(`Clicked on ${section}`)
}

const handleEvent = () => {
  showMyEvents.value = true
}

const handleCreateEvent = () => {
  showCreateEventForm.value = true
}

const handleClose = () => {
  showCreateEventForm.value = false
  router.push('/logged-main-page')
  showMyEvents.value = false
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
