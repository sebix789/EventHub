<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <div class="landing-page">
    <div class="top-app-bar">
      <div class="title">
        <router-link to="/" class="title">
            <img src="../assets/title.png" alt="EventHub" />
        </router-link>

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
    </div>
    <div class="main-container">
      <div class="left-bar-container">
        <slot name="left-bar"></slot>
      </div>
    </div>
  </div>
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
        <label class="card-label" for="email">Email:</label>
        <input
          class="card-input"
          id="email"
          placeholder="Email"
          v-model="email"
          type="text"
          @blur="isTouched = true"
          :class="{ 'is-invalid': !isValid && isTouched }"
          required
        />
        <span v-if="!isValid && isTouched" class="bottom-label error-message">
          Please enter a valid email address.
        </span>
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
      <div class="content-wrapper">
        <label class="card-label" for="repeatPassword">Repeat Password:</label>
        <input
          class="card-input"
          id="repeatPassword"
          placeholder="Repeat Password"
          v-model="repeatPassword"
          @blur="isTouched = true"
          :class="{ 'is-invalid': !passwordCheck && isTouched }"
          type="password"
          required
        />
        <p
          v-if="!passwordCheck && isTouched"
          class="bottom-label error-message"
        >
          Passwords do not match.
        </p>
      </div>
      <div class="terms-conditions-wrapper content-wrapper">
        <input type="checkbox" id="agreeTerms" v-model="agreeTerms" />
        <label class="bottom-label" for="agreeTerms"
          >Agree to terms & conditions</label
        >
      </div>
      <button class="btn login-button" type="submit" :disabled="isDisabled">
        Create an account
      </button>
    </form>
    <label class="bottom-label card-label" for="login"
      >Already have an account?</label
    >
    <button class="signup-button" @click="handleSwitchCard">Log in</button>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, watch } from 'vue'
import axios from 'axios'
import '@/assets/card.css'
import { useRouter } from 'vue-router'

const router = useRouter()

axios.defaults.baseURL = 'http://localhost:5000'

const emit = defineEmits(['close', 'switch-card'])
const username = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const agreeTerms = ref(false)
const isTouched = ref(false)

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const isValid = computed(() => emailRegex.test(email.value))
const passwordCheck = computed(() => password.value === repeatPassword.value)
const isDisabled = computed(
  () => !agreeTerms.value || !isValid.value || !passwordCheck.value
)

const handleSubmit = async () => {
  isTouched.value = true
  if (!isDisabled.value) {
    try {
      const response = await axios.post('/api/auth/signup', {
        username: username.value,
        email: email.value,
        password: password.value
      })
      router.push('/login')
    } catch (error) {
      console.error(error)
    }
  }
}

const handleClose = () => {
  emit('close')
}

const handleSwitchCard = () => {
  emit('switch-card')
}
</script>
