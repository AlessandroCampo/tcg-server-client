import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { myRouter } from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from "primevue/button"

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(myRouter)
app.mount('#app')
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.component('Button', Button);