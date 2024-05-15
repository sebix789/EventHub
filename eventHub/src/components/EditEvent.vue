<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:400,700"
  />
  <div class="card event-container">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <h1 class="event-title">Edit Details</h1>
    <span class="event-subtitle">Fill in the details</span>
    <form class="login-form event-form" @submit.prevent="handleSubmit">
      <div class="content-wrapper event-wrapper">
        <label class="card-label event-label" for="date">Date</label>
        <input
          class="card-input"
          id="date"
          placeholder="Select Date"
          v-model="date"
          type="date"
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
import { useRoute } from 'vue-router'
import '@/assets/card.css'
import '@/assets/editEvent.css'

axios.defaults.baseURL = 'http://localhost:5000/api/events'

const route = useRoute()
const emit = defineEmits(['close'])
const toast = useToast()

const eventId = ref(route.params.id)
const date = ref('')
const location = ref('')
const description = ref('')
const image = ref(null)
const imageFile = ref(null)
const errorMessage = ref('')

const handleSubmit = async () => {
  try {
    // Create a FormData instance
    const formData = new FormData()

    // Append the form fields to the FormData instance
    formData.append('date', date.value)
    formData.append('location', location.value)
    formData.append('description', description.value)
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    // Send a PUT request to the server to update the event
    const response = await axios.put(
      `/updateEvent/${eventId.value}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    // Update the event data with the response data
    date.value = response.data.date
    location.value = response.data.location
    description.value = response.data.description
    image.value = response.data.image

    console.log('Event updated:', response.data)
    toast.success('Event updated successfully!')
  } catch (error) {
    toast.error('Error updating event')
    errorMessage.value = 'Error updating event: ' + error.message
    console.error(errorMessage.value)
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

watch([date, location, description, image, imageFile], () => {
  errorMessage.value = ''
})
</script>
