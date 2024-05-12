<template>
    <LandingPage :isLoggedIn="isLoggedIn.value">
        <template v-slot:header>
            <div class="card">
                <h2>My Profile</h2>
            </div>
        </template>
    </LandingPage>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import LandingPage from './LandingPage.vue'
import '@/assets/card.css'

const router = useRouter()
const isLoggedIn = inject('isLoggedIn')
</script>