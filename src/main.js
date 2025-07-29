import './assets/main.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { useKakao } from 'vue3-kakao-maps'

useKakao('4215b6b611faa29a4ce872b00b8f8e8b', { libraries: ['services'] })
const app = createApp(App)
app.use(createPinia())
app.use(router)

document.fonts.load('24px "Material Icons"').then(() => {
  document.documentElement.classList.add('material-icons-loaded')
})

app.mount('#app')
