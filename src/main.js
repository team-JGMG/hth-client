import './assets/main.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { useKakao } from 'vue3-kakao-maps'

useKakao('4215b6b611faa29a4ce872b00b8f8e8b', { libraries: ['services'] })

Promise.all([
  document.fonts.load('24px "Material Symbols Outlined"'),
  document.fonts.load('24px "Material Symbols Rounded"'),
  document.fonts.load('24px "Material Symbols Sharp"'),
]).then(() => {
  document.documentElement.classList.add('icons-loaded')

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
})
