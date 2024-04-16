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
      <button class="btn login-button" type="submit">Log in</button>
    </form>
    <label class="bottom-label card-label" for="singup">Need an account?</label>
    <button class="singup-button" @click="handleSwitchCard">Sing Up</button>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import '@/assets/card.css'

export default defineComponent({
  name: 'LoginCard',
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')

    const handleSubmit = () => {
      alert('Log in successfully!')
      console.log(
        'Login attempt with email: ',
        email.value,
        ' and password: ',
        password.value
      )
    }

    const handleClose = () => {
      emit('close')
    }

    const handleSwitchCard = () => {
      emit('switch-card')
    }

    return {
      email,
      password,
      emit,
      handleClose,
      handleSubmit,
      handleSwitchCard
    }
  }
})
</script>
