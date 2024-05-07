<template>
  <div class="card">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <form class="login-form" @submit.prevent="handleSubmit">
      <div class="content-wrapper">
        <label class="card-label" for="username">Username:</label>
        <input
          class="card-input"
          id="username"
          placeholder="Username"
          v-model="username"
          type="text"
          required
        />
      </div>
      <div class="content-wrapper">
        <label class="card-label" for="password">Password:</label>
        <input
          class="card-input"
          id="password"
          placeholder="Password"
          v-model="password"
          type="password"
          required
        />
      </div>
      <p v-if="errorMessage" class="bottom-label error-message err">{{ errorMessage }}</p>
      <button class="btn login-button" type="submit">Log in</button>
    </form>
    <label class="bottom-label card-label" for="signup">Need an account?</label>
    <button class="signup-button" @click="handleSwitchCard">Sign Up</button>
  </div>
</template>

<script setup>
import { ref, defineEmits, inject, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import '@/assets/card.css'

axios.defaults.baseURL = 'http://localhost:5000'

const emit = defineEmits(['close', 'switch-card'])
const username = ref('')
const password = ref('')
const router = useRouter()
const isLoggedIn = inject('isLoggedIn')
const errorMessage = ref('')

const handleSubmit = async () => {
  try {
    const response = await axios.post('/api/auth/login', {
      username: username.value,
      password: password.value
    })
    isLoggedIn.value = true
    console.log('Received token:', response.data.token)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', response.data.username)
    router.push({ name: 'LoggedMainPage' })
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Username or password is incorrect'
    } else {
      errorMessage.value = 'An unknown error occurred'
    }
  }
}

const handleClose = () => {
  emit('close')
}

const handleSwitchCard = () => {
  emit('switch-card')
}

watch([username, password], () => {
  errorMessage.value = ''
})
</script>

<style scoped>
.err {
  margin-top: 0;
}
</style>
