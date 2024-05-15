<template>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto:400,700"
  />
  <div class="card profile-card">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="profile-title" v-for="user in users" :key="user._id">
      Welcome {{ user.firstname }}!
    </h2>
    <div class="profile-container">
      <div class="profile-wrapper" v-for="user in users" :key="user._id">
        <img
          class="profile-image"
          :src="
            getImageUrl(user.userImage) || 'https://randomuser.me/api/portraits'
          "
        />
        <div class="profile-title">
          <h1>{{ user.firstname }}</h1>
          <h1>{{ user.surname }}</h1>
        </div>
      </div>
      <form class="login-form event-form" @submit.prevent="handleSubmit">
        <div class="content-wrapper event-wrapper">
          <label class="card-label event-label" for="firstname"
            >First Name</label
          >
          <input
            class="card-input"
            id="firstname"
            placeholder="First Name"
            v-model="firstname"
            type="text"
            required
          />
        </div>
        <div class="content-wrapper event-wrapper">
          <label class="card-label event-label" for="surname">Surname</label>
          <input
            class="card-input"
            id="surname"
            placeholder="Surname"
            v-model="surname"
            type="text"
            required
          />
        </div>
        <div class="content-wrapper event-wrapper">
          <label class="card-label event-label" for="email">Change Email</label>
          <input
            class="card-input"
            id="email"
            placeholder="Email"
            v-model="email"
            type="text"
            @blur="isTouched = true"
            :class="{ 'is-invalid': !isValid && isTouched }"
          />
          <span v-if="!isValid && isTouched" class="bottom-label error-message">
            Please enter a valid email address.
          </span>
        </div>
        <div class="content-wrapper event-wrapper">
          <label class="card-label event-label" for="password"
            >Change Password:</label
          >
          <input
            class="card-input"
            id="password"
            placeholder="Password"
            v-model="password"
            type="password"
          />
        </div>
        <div class="content-wrapper event-wrapper">
          <label class="card-label event-label" for="repeatPassword"
            >Repeat New Password:</label
          >
          <input
            class="card-input"
            id="repeatPassword"
            placeholder="Repeat Password"
            v-model="repeatPassword"
            @blur="isTouched = true"
            :class="{ 'is-invalid': !passwordCheck && isTouched }"
            type="password"
          />
          <p
            v-if="!passwordCheck && isTouched"
            class="bottom-label error-message"
          >
            Passwords do not match.
          </p>
          <p v-if="errorMessage" class="bottom-label error-message err">
            {{ errorMessage }}
          </p>
        </div>
        <div class="content-wrapper event-wrapper">
          <label class="card-label event-label" for="userImage"
            >Profile Image</label
          >
          <input
            class="card-input"
            id="userImage"
            type="file"
            @change="handleImageUpload"
            style="display: none"
          />
          <label for="userImage" class="btn login-button event-button">
            {{ imageFile ? imageFile.name : 'Upload Image' }}
          </label>
        </div>
        <button class="btn login-button" type="submit">Save Profile</button>
      </form>
    </div>
  </div>
  <div class="header-section card logged-card">
    <h1>My Favorite Events</h1>
  </div>
  <div v-if="favorites.length > 0" class="logged-event-container">
    <button
      v-if="favorites.length > 2"
      class="slider-button left btn-slide-left"
      @click="scrollSlider(-1)"
    >
      <!-- Left Navigation Button -->
      <i class="fas fa-chevron-left"></i>
    </button>
    <div class="events-container events-wrapper">
      <div
        v-for="favorite in visibleEvents"
        :key="favorite._id"
        class="event-card"
      >
        <div class="myevent-image-container">
          <img
            class="myevent-image"
            :src="getImageUrl(favorite.image)"
            alt="Event Image"
          />
        </div>
        <h2 class="event-data">{{ favorite.title }}</h2>
        <p class="event-data">{{ formatDate(favorite.date) }}</p>
        <p class="event-data">{{ favorite.location }}</p>
      </div>
    </div>
    <button
      v-if="favorites.length > 2"
      class="slider-button right btn-slide-right"
      @click="scrollSlider(1)"
    >
      <!-- Right Navigation Button -->
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import '@/assets/card.css'
import '@/assets/myProfile.css'

axios.defaults.baseURL = 'http://localhost:5000'

const router = useRouter()
const toast = useToast()
const emit = defineEmits(['close'])

const firstname = ref('')
const surname = ref('')
const email = ref('')

const password = ref('')
const userImage = ref(null)
const imageFile = ref(null)
const repeatPassword = ref('')

const isTouched = ref(false)
const errorMessage = ref('')
const localUsername = ref('')
const users = ref([])
const favorites = ref([])
const visibleEventsIndex = ref(0)

onMounted(async () => {
  localUsername.value = sessionStorage.getItem('username')
  try {
    const response = await axios.get(`/api/auth/users/${localUsername.value}`)
    users.value = response.data
    console.log('User data:', users.value)
    if (users.value.length > 0) {
      firstname.value = users.value[0].firstname
      surname.value = users.value[0].surname
      email.value = users.value[0].email
    }

    // Fetch the favorites
    const favoritesResponse = await axios.get(
      `/api/auth/getFavorites/${localUsername.value}`
    )
    const favoriteIds = favoritesResponse.data

    // Fetch the data for each favorite event
    const favoritePromises = favoriteIds.map(title =>
      axios.get(`/api/events/getEventByTitle/${title}`)
    )
    const favoriteResponses = await Promise.all(favoritePromises)
    favorites.value = favoriteResponses.map(response => response.data)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
})

const scrollSlider = direction => {
  const totalEvents = favorites.value.length
  visibleEventsIndex.value =
    (visibleEventsIndex.value + direction + totalEvents) % totalEvents
}

const visibleEvents = computed(() => {
  const totalEvents = favorites.value.length

  if (totalEvents === 1) {
    return favorites.value
  }

  const startIndex = visibleEventsIndex.value
  const endIndex = startIndex + 2

  return [
    ...favorites.value.slice(startIndex, endIndex),
    ...favorites.value.slice(0, Math.max(0, 2 - (totalEvents - startIndex)))
  ]
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isValid = computed(
  () => email.value === '' || emailRegex.test(email.value)
)
const passwordCheck = computed(() => password.value === repeatPassword.value)

const handleSubmit = async () => {
  isTouched.value = true
  if (isValid.value && passwordCheck.value) {
    const username = sessionStorage.getItem('username')

    // Create a FormData instance
    const formData = new FormData()

    formData.append('username', sessionStorage.getItem('username'))
    formData.append('firstname', firstname.value)
    formData.append('surname', surname.value)

    if (email.value) {
      formData.append('email', email.value)
    }

    if (password.value) {
      formData.append('password', password.value)
    }

    if (userImage.value) {
      formData.append('userImage', imageFile.value)
    }

    try {
      await axios.put(`/api/auth/update/${localUsername.value}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      firstname.value = ''
      surname.value = ''
      email.value = ''
      password.value = ''
      repeatPassword.value = ''
      userImage.value = null
      imageFile.value = null
      toast.success('Profile updated successfully')

      // After successful update, update form fields
      const response = await axios.get(
        `/api/auth/users/${localStorage.getItem('username')}`
      )
      users.value = response.data
      if (users.value.length > 0) {
        const user = users.value[0]
        firstname.value = user.firstname
        surname.value = user.surname
        email.value = user.email
      }
    } catch (error) {
      toast.error('Something went wrong, Please try again.')
      console.error('Failed to update profile:', error)
      if (error.response && error.response.status === 500) {
        errorMessage.value =
          'Failed to update profile, check your data and try again'
      } else {
        errorMessage.value = 'An unknown error occurred'
      }
    }
  } else {
    errorMessage.value = 'Please fill in all required fields'
  }
}

const formatDate = date => {
  const eventDate = new Date(date)
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
  return eventDate.toLocaleDateString('en-GB', options)
}

const handleImageUpload = event => {
  userImage.value = event.target.files[0]
  imageFile.value = event.target.files[0]
}

const getImageUrl = base64Image => {
  if (base64Image) {
    return `data:image/jpeg;base64,${base64Image}`
  }
  return 'https://via.placeholder.com/150'
}

const handleClose = () => {
  emit('close')
}

watch(
  [firstname, surname, email, password, repeatPassword, userImage, imageFile],
  () => {
    errorMessage.value = ''
  }
)
</script>
