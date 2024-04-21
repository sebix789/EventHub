<template>
  <div id="app" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <LandingPage />
  </div>
</template>

<script setup lang="ts">
import LandingPage from './components/LandingPage.vue'
import backgroundImage from './assets/backgroundImage.jpg'
</script>

<style>
/* Global styles */
</style>
