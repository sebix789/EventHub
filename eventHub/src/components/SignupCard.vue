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
        <label class="card-label" for="password">Repeat Password:</label>
        <input
          :class="{ 'is-invalid': !passwordCheck && isTouched }"
          class="card-input"
          id="repeatPassword"
          placeholder="Repeat Password"
          v-model="repeatPassword"
          @blur="isTouched = true"
          type="password"
          required
        />
        <p
          v-if="isPasswordValid"
          class="bottom-label"
          :class="{
            'error-message': !passwordCheck,
            'success-message': passwordCheck
          }"
        >
          {{ passwordMatchMessage }}
        </p>
        <div class="terms-conditions-wrapper content-wrapper">
          <input
            type="checkbox"
            id="agreeTerms"
            :checked="agreeTerms"
            @change="handleUpdateTerms"
            v-model="agreeTerms"
          />
          <label class="bottom-label" for="agreeTerms"
            >Agree to terms & conditions</label
          >
        </div>
      </div>
      <button class="btn login-button" type="submit" :disabled="isDisabled">
        Create an account
      </button>
    </form>
    <label class="bottom-label card-label" for="singup"
      >Already have an account?</label
    >
    <button class="singup-button" @click="handleSwitchCard">Log in</button>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import '@/assets/card.css'

export default defineComponent({
  name: 'SingupCard',
  setup(props, { emit }) {
    const email = ref('')
    const password = ref('')
    const repeatPassword = ref('')
    const agreeTerms = ref(false)
    const isTouched = ref(false)
    const passwordCheck = ref(false)

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const isValid = computed(() => emailRegex.test(email.value))
    const isDisabled = computed(() => !agreeTerms.value)

    const isPasswordValid = computed(() => {
      if (repeatPassword.value.length === 0) {
        return (passwordCheck.value = false)
      }
      return password.value === repeatPassword.value
        ? (passwordCheck.value = true)
        : (passwordCheck.value = false)
    })

    const passwordMatchMessage = computed(() => {
      return passwordCheck
        ? 'Password match correctly'
        : "Password didn't match"
    })

    const handleSubmit = () => {
      isTouched.value = true
      if (!isPasswordValid.value || !agreeTerms.value || !isValid.value) {
        alert('Please correct the errors before submitting')
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

    const handleSwitchCard = () => {
      emit('switch-card')
    }

    const handleUpdateTerms = event => {
      agreeTerms.value = event.target.checked
    }

    watch(agreeTerms, (newValue, oldValue) => {
      console.log(`Checkbox value changed from ${oldValue} to ${newValue}`)
    })

    return {
      email,
      password,
      isDisabled,
      isTouched,
      isValid,
      emailRegex,
      emit,
      handleClose,
      handleSubmit,
      handleSwitchCard,
      handleUpdateTerms,
      isPasswordValid,
      repeatPassword,
      passwordCheck,
      passwordMatchMessage
    }
  }
})
</script>
