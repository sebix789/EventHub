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
            id="title"
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
</template>

<script setup>
import { ref, defineEmits, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import '@/assets/card.css'
import '@/assets/myProfile.css'

axios.defaults.baseURL = 'http://localhost:5000'

const router = useRouter()
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

onMounted(async () => {
  localUsername.value = localStorage.getItem('username')
  try {
    const response = await axios.get(`/api/auth/users/${localUsername.value}`)
    users.value = response.data
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
})

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isValid = computed(
  () => email.value === '' || emailRegex.test(email.value)
)
const passwordCheck = computed(() => password.value === repeatPassword.value)

const handleSubmit = async () => {
  isTouched.value = true
  if (isValid.value && passwordCheck.value) {
    const username = localStorage.getItem('username')

    // Create a FormData instance
    const formData = new FormData()

    formData.append('username', localStorage.getItem('username'))
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
      alert('Profile updated')
    } catch (error) {
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

const handleImageUpload = event => {
  userImage.value = event.target.files[0]
  imageFile.value = event.target.files[0]
  console.log('Image uploaded:', imageFile.value)
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
