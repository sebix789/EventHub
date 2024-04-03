<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <div class="landing-page">
    <div class="top-app-bar">
      <div class="search-container">
        <input
          type="text"
          class="search-input"
          placeholder="Search for events"
        />
        <i @click="search" class="fas fa-search search-icon"></i>
      </div>

      <button @click="login" class="login-button">Log In</button>
    </div>
    <h2 class="header">Welcome to EventHub</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LandingPage',
  setup() {
    const searchQuery = ref('')

    function search() {
      alert(`Searching for: ${searchQuery.value}`)
    }

    function login() {
      alert('Logging in...')
    }

    return { searchQuery, search, login }
  }
})
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100vw;
  height: calc(100vh - 4px);
}

.header {
  font-size: 2.5rem;
}

.landing-page {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url('../assets//backgroundImage.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.top-app-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  background: linear-gradient(to right, #695d5d, #fff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.top-app-bar .login-button {
  margin-right: 2.5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  font-size: 12px;
}

.login-button {
  margin-left: 10px;
}

.login-button {
  cursor: pointer;
}

.search-container {
  position: relative;
  display: inline-block;
}

.search-input {
  background-color: white;
  color: #000;
  padding: 10px 100px 10px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  color: #333;
  cursor: pointer;
}
</style>
