import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'leaflet/dist/leaflet.css'
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

app.use(router)
app.use(Toast, {
  position: POSITION.TOP_RIGHT
})

app.mount('#app')
