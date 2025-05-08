import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { myRouter } from './router'


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(myRouter)
app.mount('#app')