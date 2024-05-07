<template>
  <div id="app" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import backgroundImage from './assets/backgroundImage.jpg'
import { ref, provide } from 'vue'

const isLoggedIn = ref(false)

provide('isLoggedIn', isLoggedIn)
</script>

<style>
/* Global styles */
</style>
