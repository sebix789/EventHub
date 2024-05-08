<template>
  <div class="card">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <h1 class="event-title">Event Details</h1>
    <span class="event-subtitle">Fill in the details</span>
    <form class="login-form event-form" @submit.prevent="handleSubmit">
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="name">Event Name</label>
        <input
          class="card-input"
          id="name"
          placeholder="Event Name"
          v-model="name"
          type="text"
          required
        />
      </div>
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="email">Date</label>
        <input
          class="card-input"
          id="date"
          placeholder="Select Date"
          v-model="date"
          type="date"
          required
        />
      </div>
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="password">Location</label>
        <input
          class="card-input"
          id="location"
          placeholder="Enter Location"
          v-model="location"
          type="text"
          required
        />
      </div>
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="description"
          >Event description</label
        >
        <input
          class="card-input"
          id="description"
          placeholder="Enter event description"
          v-model="description"
          required
        />
      </div>
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="image">Event Image</label>
        <input
          class="card-input"
          id="image"
          type="file"
          @change="handleImageUpload"
          style="display: none"
        />
        <label for="image" class="btn login-button event-button">
          {{ imageFile ? imageFile.name : 'Upload Image' }}
        </label>
      </div>
      <button class="btn login-button" type="submit">Save Event</button>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'
import axios from 'axios'
import '@/assets/card.css'
import '@/assets/createEvent.css'

axios.defaults.baseURL = 'http://localhost:5000'

const emit = defineEmits(['close', 'switch-card'])
const name = ref('')
const date = ref('')
const location = ref('')
const description = ref('')
const image = ref(null)
const imageFile = ref(null)

onMounted(() => {
  let link = document.createElement('link')
  link.href = 'https://fonts.googleapis.com/css?family=Roboto:400,700'
  link.rel = 'stylesheet'
  document.head.appendChild(link)
})

const handleSubmit = async () => {
  console.log('Submitting form')
}

const handleImageUpload = event => {
  image.value = event.target.files[0]
  imageFile.value = event.target.files[0]
  console.log('Image uploaded:', imageFile.value)
}

const handleClose = () => {
  emit('close')
}
</script>
