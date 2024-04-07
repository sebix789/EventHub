<template>
  <div id="app">
    <LandingPage />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LandingPage from './components/LandingPage.vue'
import backgroundImage from './assets/backgroundImage.jpg'

export default defineComponent({
  name: 'App',
  components: {
    LandingPage
  },
  setup() {
    return { backgroundImage }
  }
})
</script>

<style>
/* Global styles */
</style>
