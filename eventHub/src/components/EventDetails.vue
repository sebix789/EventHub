<template>
  <div
    class="events-container events-wrapper event-details-box"
    v-if="props.event"
  >
    <div class="event-card event-details-card">
      <div class="event-details-container">
        <div class="myevent-image-container">
          <img
            class="myevent-image"
            :src="getImageUrl(props.event.image)"
            alt="Event image"
          />
        </div>
        <div class="event-details-wrapper">
          <h2 class="event-data">{{ props.event.title }}</h2>
          <h2 class="event-data">{{ formatDate(props.event.date) }}</h2>
        </div>
      </div>
      <p class="event-data">{{ props.event.description }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import '@/assets/landingPage.css'
import '@/assets/myEvents.css'

const props = defineProps({
  event: Object
})

const formatDate = date => {
  const eventDate = new Date(date)
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return eventDate.toLocaleDateString('en-GB', options)
}

const getImageUrl = base64Image => {
  if (base64Image) {
    return `data:image/jpeg;base64,${base64Image}`
  }
  return 'https://via.placeholder.com/150'
}
</script>
