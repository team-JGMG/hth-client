import './assets/main.css'
import 'v-calendar/style.css'
import './firebase'

import App from './App.vue'
import VCalendar from 'v-calendar'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
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
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(VCalendar, {})
  app.use(pinia)
  app.use(router)
  app.mount('#app')
})

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'FCM_MESSAGE') {
      const { title, body } = event.data.payload || {}
      // Pinia 토스트 사용
      import('@/stores/toast').then(({ useToastStore }) => {
        const toast = useToastStore()
        toast.show({ title: title || '알림', body: body || '', timeout: 4000 })
      })
    }
  })
}
