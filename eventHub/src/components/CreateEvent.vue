<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:400,700"
  />
  <div class="card event-container">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <h1 class="event-title">Event Details</h1>
    <span class="event-subtitle">Fill in the details</span>
    <form class="login-form event-form" @submit.prevent="handleSubmit">
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="title">Event Name</label>
        <input
          class="card-input"
          id="title"
          placeholder="Event Name"
          v-model="title"
          type="text"
          required
        />
        <p v-if="errorMessage" class="bottom-label error-message err">
          {{ errorMessage }}
        </p>
      </div>
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="date">Date</label>
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
        <label class="card-label event-label" for="location">Location</label>
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
import { ref, defineEmits, watch } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import '@/assets/card.css'
import '@/assets/createEvent.css'

axios.defaults.baseURL = 'http://localhost:5000'

const toast = useToast()
const emit = defineEmits(['close'])

const title = ref('')
const date = ref('')
const location = ref('')
const description = ref('')
const image = ref(null)
const imageFile = ref(null)
const errorMessage = ref('')

const handleSubmit = async () => {
  // Get the username from local storage
  const username = localStorage.getItem('username')

  // Create a FormData instance
  const formData = new FormData()

  // Append the form fields to the FormData instance
  formData.append('username', username)
  formData.append('title', title.value)
  formData.append('date', date.value)
  formData.append('location', location.value)
  formData.append('description', description.value)
  formData.append('image', imageFile.value)

  try {
    // Make a POST request to the server-side endpoint
    const response = await axios.post('/api/events/createEvent', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    toast.success('Event created successfully')
    console.log('Response:', response.data)

    // Clear the form fields
    title.value = ''
    date.value = ''
    location.value = ''
    description.value = ''
    image.value = null
    imageFile.value = null
  } catch (error) {
    if (error.response && error.response.status === 400) {
      errorMessage.value = 'An event with this title already exists'
    }
  }
}

const handleImageUpload = event => {
  image.value = event.target.files[0]
  imageFile.value = event.target.files[0]
  console.log('Image uploaded:', imageFile.value)
}

const handleClose = () => {
  emit('close')
}

watch([title, date, location, description, image, imageFile], () => {
  errorMessage.value = ''
})
</script>
