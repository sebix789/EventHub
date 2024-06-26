<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <div class="landing-page">
    <div class="top-app-bar">
      <slot name="topAppBar">
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
        <button
          v-else-if="isLoggedIn"
          @click="returnToMainPage"
          class="login-button"
        >
          Return to Main Page
        </button>
        <button v-else @click="logout" class="login-button">Logout</button>
      </slot>
    </div>
    <div class="main-container">
      <div class="left-bar-container">
        <slot name="left-bar"></slot>
      </div>
      <div class="header-container header-base-container">
        <slot name="header">
          <div class="header header-wrapper">
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
              This Week
            </button>
            <button class="header-filter" @click="fetchAllEvents()">
              All Events
            </button>
          </div>
          <EventDetails
            v-if="selectedEvent"
            :event="selectedEvent"
            :key="selectedEvent._id"
          />
        </slot>
        <div
          v-if="events.length > 0 && !selectedEvent"
          class="events-container event-box"
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
              v-if="!selectedEvent"
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
        <div
          v-if="showNoEventsMessage && events != null && events.length === 0"
          class="no-events-message"
        >
          No events to display.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  inject,
  defineProps,
  onMounted,
  computed,
  reactive,
  provide
} from 'vue'
import { useRouter } from 'vue-router'
import EventDetails from './EventDetails.vue'
import '@/assets/landingPage.css'
import '@/assets/myEvents.css'
import '@/assets/eventDetails.css'
import axios from 'axios'

const router = useRouter()

const isLoggedIn = inject('isLoggedIn')
const events = ref([])
const visibleEventsIndex = ref(0)
const showNoEventsMessage = ref(false)
const selectedEvent = ref(null)
const searchInput = ref('')

const props = defineProps({
  isLoggedIn: Boolean
})

const axiosInstanceEvent = axios.create({
  baseURL: 'http://localhost:5000/api/events'
})

const state = reactive({
  searchResult: [],
  noSearch: true
})

onMounted(() => {
  const token = sessionStorage.getItem('token')
  isLoggedIn.value = !!token
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

    if (state.searchResult.length > 0) {
      await selectEvent(state.searchResult[0])
    }
  } catch (error) {
    console.error('Error while searching:', error)
  }
}

const returnToMainPage = () => {
  router.push('/logged-main-page')
}

const logout = () => {
  isLoggedIn.value = false

  sessionStorage.clear()
  router.push({ name: 'LandingPage' })
}

const redirectToLogin = () => {
  router.push('/login')
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
    showNoEventsMessage.value = events.value.length === 0
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

const selectEvent = async eventTitle => {
  try {
    const response = await axiosInstanceEvent.get(
      `getEventByTitle/${eventTitle}`
    )
    selectedEvent.value = response.data
  } catch (error) {
    console.error('Error fetching event:', error)
  }
}

provide('handleSearch', handleSearch)
provide('searchInput', searchInput)
provide('selectEvent', selectEvent)
provide('selectedEvent', selectedEvent)
</script>
