import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';

const app = createApp(App)

app.use(router)

app.use(createPinia())
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});
app.mount('#app')
