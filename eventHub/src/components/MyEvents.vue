<template>
  <div class="card my-events-card">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <h1 class="event-title">My Events</h1>
    <div class="slider-container" v-if="events.length <= 3">
      <!-- Slider for up to 3 events -->
      <div class="myevent-arrowSlider">
        <div v-for="event in events" :key="event._id" class="myevent-card">
          <!-- Event Card -->
          <div
            class="myevent-image-container"
            @click="handleOnClickEvent(event)"
          >
            <div class="myevent-image">
              <img :src="getImageUrl(event.image)" alt="Event Image" />
            </div>
          </div>
          <div class="myevent-text-content">
            <div class="myevent-title">{{ event.title }}</div>
            <div class="myevent-date">{{ formatDate(event.date) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- Slider for more than 3 events -->
      <div class="myevent-arrowSlider">
        <button class="slider-button left" @click="scrollSlider(-1)">
          <!-- Left Navigation Button -->
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="myevent-slider">
          <div
            v-for="event in visibleEvents"
            :key="event._id"
            class="myevent-card"
          >
            <!-- Visible Events -->
            <div
              class="myevent-image-container"
              @click="handleOnClickEvent(event)"
            >
              <div class="myevent-image">
                <img :src="getImageUrl(event.image)" alt="Event Image" />
              </div>
            </div>
            <div class="myevent-text-content">
              <div class="myevent-title">
                {{ event.title }}
              </div>
              <div class="myevent-date">
                {{ formatDate(event.date) }}
              </div>
            </div>
          </div>
        </div>
        <button class="slider-button right" @click="scrollSlider(1)">
          <!-- Right Navigation Button -->
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted, computed } from 'vue'
import axios from 'axios'
import '@/assets/card.css'
import '@/assets/myEvents.css'
import router from '@/router/router'

const username = ref('')
const events = ref([])
const emit = defineEmits('close')
const visibleEventsIndex = ref(0)

const axiosGetMyEvents = axios.create({
  baseURL: 'http://localhost:5000/api/events/'
})

onMounted(async () => {
  const localUsername = localStorage.getItem('username')
  if (localUsername) {
    username.value = localUsername
    const response = await axiosGetMyEvents.get(`getEvents/${username.value}`)
    events.value = response.data
  }
})

const getImageUrl = base64Image => {
  if (base64Image) {
    return `data:image/jpeg;base64,${base64Image}`
  }
  return 'https://via.placeholder.com/150'
}

const formatDate = date => {
  const eventDate = new Date(date)
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return eventDate.toLocaleDateString('en-GB', options)
}

const handleClose = () => {
  emit('close')
}

const scrollSlider = direction => {
  const totalEvents = events.value.length
  visibleEventsIndex.value =
    (visibleEventsIndex.value + direction + totalEvents) % totalEvents
}

const visibleEvents = computed(() => {
  const startIndex = visibleEventsIndex.value
  const endIndex = startIndex + 3
  return [
    ...events.value.slice(startIndex, endIndex),
    ...events.value.slice(
      0,
      Math.max(0, 3 - (events.value.length - startIndex))
    )
  ]
})

const handleOnClickEvent = clickedEvent => {
  // Emitowanie zdarzenia 'onSelectedEvent' z przekazanym obiektem event
  const eventId = clickedEvent._id
  router.push(`/event/${eventId}`)
}
</script>
