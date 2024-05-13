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
        <div class="main-page-container">
          <div
            v-if="
              !$route.path.includes('/my-events') &&
              !$route.path.includes('/create-event') &&
              !$route.path.includes('/my-profile')
            "
            class="header-section card logged-card"
          >
            <h1 class="title-section">Plan Your Events</h1>
            <span>Organize your upcoming events seamlessly</span>
            <button class="login-button create-btn" @click="handleCreateEvent">
              Create Event
            </button>
          </div>
          <router-view
            @close="handleClose"
            class="header-section card"
          ></router-view>
          <div class="header-section card logged-card">
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
              <button class="header-filter" @click="fetchAllEvents()">
                All Events
              </button>
            </div>
          </div>
          <!-- Dodaj sekcję na wyświetlanie wydarzeń -->
          <div
            v-if="events.length > 0 && events.length <= 2"
            class="logged-event-container"
          >
            <button
              class="slider-button left btn-slide-left"
              @click="scrollSlider(-1)"
            >
              <!-- Left Navigation Button -->
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="events-container events-wrapper">
              <div
                v-for="event in visibleEvents"
                :key="event._id"
                class="event-card"
              >
                <div class="myevent-image-container">
                  <img
                    class="myevent-image"
                    :src="getImageUrl(event.image)"
                    alt="Event Image"
                  />
                </div>
                <h2 class="event-data">{{ event.title }}</h2>
                <p class="event-data">{{ formatDate(event.date) }}</p>
                <!-- Formatowanie daty przy użyciu metody formatDate -->
                <p class="event-data">{{ event.location }}</p>
                <p class="event-data">{{ event.description }}</p>
              </div>
            </div>
            <div
              v-if="showNoEventsMessage && events.length === 0"
              class="no-events-message"
            >
              No events to display.
            </div>
            <button
              class="slider-button right btn-slide-right"
              @click="scrollSlider(1)"
            >
              <!-- Right Navigation Button -->
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </template>
    </LandingPage>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LandingPage from './LandingPage.vue'
import '@/assets/loggedMainPage.css'
import '@/assets/card.css'
import '@/assets/landingPage.css'

const router = useRouter()

const username = ref('')
const showCreateEventForm = ref(false)
const isLoggedIn = inject('isLoggedIn')
const events = ref([]) // Nowa zmienna reaktywna na wydarzenia
const showNoEventsMessage = ref(false) // Flaga dla komunikatu o braku wydarzeń
const visibleEventsIndex = ref(0)

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

const handleProfile = section => {
  router.push('/logged-main-page/my-profile')
}

const handleEvent = () => {
  router.push('/logged-main-page/my-events')
}

const handleCreateEvent = () => {
  router.push('/logged-main-page/create-event')
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

const scrollSlider = direction => {
  const totalEvents = events.value.length
  visibleEventsIndex.value =
    (visibleEventsIndex.value + direction + totalEvents) % totalEvents
}

const visibleEvents = computed(() => {
  const startIndex = visibleEventsIndex.value
  const endIndex = startIndex + 2
  return [
    ...events.value.slice(startIndex, endIndex),
    ...events.value.slice(
      0,
      Math.max(0, 2 - (events.value.length - startIndex))
    )
  ]
})

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

const fetchAllEvents = async () => {
  try {
    const response = await axiosInstanceEvent.get('/getAllEvents')
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
