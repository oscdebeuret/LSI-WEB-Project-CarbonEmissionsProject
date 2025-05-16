import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Vue3GoogleOAuth } from 'vue3-google-login'

import './assets/tailwind.css'

const app = createApp(App)

app.use(Vue3GoogleOAuth, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
})

app.use(createPinia())
app.use(router)
app.mount('#app')
