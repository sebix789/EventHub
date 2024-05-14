<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <LandingPage :isLoggedIn="isLoggedIn.value">
    <template v-slot:header>
      <div class="card login-signup-card">
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
            <label class="card-label" for="firstname">First Name:</label>
            <input
              class="card-input"
              id="firstname"
              placeholder="First Name"
              v-model="firstName"
              type="text"
              required
            />
          </div>
          <div class="content-wrapper">
            <label class="card-label" for="surname">Surname:</label>
            <input
              class="card-input"
              id="surname"
              placeholder="Surname"
              v-model="surname"
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
            <span
              v-if="!isValid && isTouched"
              class="bottom-label error-message"
            >
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
            <label class="card-label" for="repeatPassword"
              >Repeat Password:</label
            >
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
          <button
            :class="{
              'btn-disabled': isDisabled,
              btn: true,
              'login-button': true
            }"
            type="submit"
            :disabled="isDisabled"
          >
            Create an account
          </button>
        </form>
        <label class="bottom-label card-label" for="login"
          >Already have an account?</label
        >
        <button class="signup-button" @click="handleSwitchCard">Log in</button>
      </div>
    </template>
  </LandingPage>
</template>

<script setup>
import { ref, computed, defineEmits, inject } from 'vue'
import axios from 'axios'
import LandingPage from './LandingPage.vue'
import '@/assets/card.css'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()

axios.defaults.baseURL = 'http://localhost:5000'

const emit = defineEmits(['close', 'switch-card'])
const firstName = ref('')
const surname = ref('')
const email = ref('')
const password = ref('')
const repeatPassword = ref('')
const agreeTerms = ref(false)
const isTouched = ref(false)
const isLoggedIn = inject('isLoggedIn')

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
      await axios.post('/api/auth/signup', {
        username: username.value,
        email: email.value,
        password: password.value,
        firstname: firstname.value,
        surname: surname.value
      })
      router.push('/login')
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error('Something went wrong, Please try again.')
      console.error(error)
    }
  }
}

const handleClose = () => {
  router.push('/')
}

const handleSwitchCard = () => {
  router.push('/login')
}
</script>
