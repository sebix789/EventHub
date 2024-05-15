<template>
  <div>
    <LandingPage :isLoggedIn="isLoggedIn.value">
      <template v-slot:topAppBar>
        <router-link to="/" class="title">
          <img src="../assets/title.png" alt="EventHub" />
        </router-link>
        <div class="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="Search for events"
            v-model="searchInput"
            @input="handleSearch"
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
      </template>
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
            v-if="events.length > 0 && !selectedEvent"
            class="logged-event-container"
          >
            <button
              v-if="events.length > 2 && !selectedEvent"
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
                <button class="event-button" @click="selectEvent(event.title)">
                  Details
                </button>
                <i
                  class="favorite-icon"
                  :class="
                    favorites.includes(event.title)
                      ? 'fas fa-heart'
                      : 'far fa-heart'
                  "
                  @click="toggleFavorite(event.title)"
                ></i>
              </div>
            </div>
            <button
              v-if="events.length > 2 && !selectedEvent"
              class="slider-button right btn-slide-right"
              @click="scrollSlider(1)"
            >
              <!-- Right Navigation Button -->
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <EventDetails
            v-if="selectedEvent"
            :event="selectedEvent"
            :key="selectedEvent._id"
          />
          <div
            v-if="showNoEventsMessage && events != null && events.length === 0"
            class="no-events-message"
          >
            No events to display.
          </div>
        </div>
      </template>
    </LandingPage>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed, provide, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LandingPage from './LandingPage.vue'
import EventDetails from './EventDetails.vue'
import '@/assets/loggedMainPage.css'
import '@/assets/card.css'
import '@/assets/landingPage.css'
import '@/assets/eventDetails.css'
import '@/assets/myEvents.css'

const router = useRouter()

const favorites = ref([])
const selectedEvent = ref(null)
const username = ref('')
const showCreateEventForm = ref(false)
const isLoggedIn = inject('isLoggedIn')
const events = ref([]) // Nowa zmienna reaktywna na wydarzenia
const showNoEventsMessage = ref(false) // Flaga dla komunikatu o braku wydarzeń
const visibleEventsIndex = ref(0)
const searchInput = ref('')

const state = reactive({
  searchResult: [],
  noSearch: true
})

const axiosInstanceUser = axios.create({
  baseURL: 'http://localhost:5000/api/auth'
})

const axiosInstanceEvent = axios.create({
  baseURL: 'http://localhost:5000/api/events'
})

const showMyEvents = ref(false)

onMounted(() => {
  const localUsername = localStorage.getItem('username')
  if (localUsername) {
    username.value = localUsername

    // Fetch the user's favorites from the database
    axiosInstanceUser
      .get(`/getFavorites/${localUsername}`)
      .then(response => {
        favorites.value = response.data
        provide('favorites', favorites)
      })
      .catch(error => {
        console.error(error)
      })
  } else {
    console.error('Username not found in local storage')
  }
})

const handleSearch = async () => {
  try {
    let searchQuery = searchInput.value.trim()

    const res = await axiosInstanceEvent.get('/search', {
      params: {
        searchQuery
      }
    })

    if (searchQuery === '') {
      state.noSearch = true
      return
    }
    state.noSearch = false
    state.searchResult = res.data.map(event => event.title)
    console.log('Search result:', state.searchResult)

    if (state.searchResult.length > 0) {
      await selectEvent(state.searchResult[0])
    }
  } catch (error) {
    console.error('Error while searching:', error)
  }
}

const toggleFavorite = async eventTitle => {
  const localUsername = localStorage.getItem('username')
  if (localUsername) {
    if (favorites.value.includes(eventTitle)) {
      favorites.value = favorites.value.filter(
        favorite => favorite !== eventTitle
      )
    } else {
      favorites.value = [...favorites.value, eventTitle]
    }

    console.log('Favorites:', favorites.value)

    try {
      await axiosInstanceUser.put(`/updateFavorites/${localUsername}`, {
        favorites: favorites.value
      })
    } catch (error) {
      console.error('Failed to update favorites:', error)
    }
  }
}

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
    selectedEvent.value = false
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
    showNoEventsMessage.value = events.value.length === 0
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
  const totalEvents = events.value.length

  if (totalEvents === 1) {
    return events.value
  }

  const startIndex = visibleEventsIndex.value
  const endIndex = startIndex + 2

  return [
    ...events.value.slice(startIndex, endIndex),
    ...events.value.slice(0, Math.max(0, 2 - (totalEvents - startIndex)))
  ]
})

const formatDate = date => {
  const eventDate = new Date(date)
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return eventDate.toLocaleDateString('en-GB', options) // Ustawienia regionalne dla formatu DD-MM-YYYY
}

const fetchEventsForThisWeek = async () => {
  try {
    selectedEvent.value = false
    const response = await axiosInstanceEvent.get('/getEventsThisWeek')
    events.value = response.data
    showNoEventsMessage.value = events.value.length === 0
  } catch (error) {
    console.error('Error while fetching events:', error)
  }
}

const fetchAllEvents = async () => {
  try {
    selectedEvent.value = false
    const response = await axiosInstanceEvent.get('/getAllEvents')
    events.value = response.data
    showNoEventsMessage.value = events.value.length === 0
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

const selectEvent = async eventTitle => {
  try {
    const response = await axiosInstanceEvent.get(
      `getEventByTitle/${eventTitle}`
    )
    selectedEvent.value = response.data
    console.log('Selected event:', eventTitle)
    console.log('Selected event:', selectedEvent.value)
  } catch (error) {
    console.error('Error fetching event:', error)
  }
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
