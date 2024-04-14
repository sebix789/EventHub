<template>
  <div class="card">
    <button class="close-button" @click="handleClose">
      <i class="fas fa-times"></i>
    </button>
    <form class="login-form" @submit.prevent="handleSubmit">
      <div class="content-wrapper">
        <label class="card-label" for="email">Email:</label>
        <input
          class="card-input"
          id="email"
          placeholder="Email"
          v-model="email"
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
      <div class="content-wrapper">
        <label class="card-label" for="password">Repeat Password:</label>
        <input
          class="card-input"
          id="repeatPassword"
          placeholder="Repeat Password"
          v-model="repeatPassword"
          type="password"
          required
        />
        <p class="bottom-label helper-text" v-if="passwordCheck">
          {{ passwordMatchMessage }}
        </p>
        <div class="terms-conditions-wrapper content-wrapper">
          <input type="checkbox" id="agreeTerms" v-model="agreeTerms" />
          <label class="bottom-label" for="agreeTerms"
            >Agree to terms & conditions</label
          >
        </div>
      </div>
      <button class="btn login-button" type="submit" :disabled="!agreeTerms">
        Create an account
      </button>
    </form>
    <label class="bottom-label card-label" for="singup"
      >Already have an account?</label
    >
    <button class="singup-button" @click.prevent.stop="handleChangeCard">Log in</button>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import '@/assets/card.css'

export default defineComponent({
  name: 'SingupCard',
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')
    const repeatPassword = ref('')
    const agreeTerms = ref(false)

    const passwordCheck = computed(() => repeatPassword.value.length > 0)

    const passwordMatchMessage = computed(() => {
      if (repeatPassword.value.length === 0) {
        return ''
      }
      return password.value === repeatPassword.value
        ? 'Password match correctly'
        : "Password didn't match"
    })

    const handleSubmit = () => {
      if (!passwordCheck.value || !agreeTerms.value) {
        alert('Passwords do not match. Please try again.')
        return
      }
      alert('Form submitted successfully!')
      console.log(
        'Account creation with Email:',
        email.value,
        'Password:',
        password.value
      )
    }

    const handleClose = () => {
      emit('close')
    }

    const handleChangeCard = (event) => {
      event.stopPropagation()
      emit('change')
    }

    return {
      email,
      password,
      emit,
      handleClose,
      handleSubmit,
      handleChangeCard,
      repeatPassword,
      passwordCheck,
      passwordMatchMessage
    }
  }
})
</script>
