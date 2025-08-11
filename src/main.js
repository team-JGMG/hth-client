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

  // ✅ 여기서 FCM 초기화 + 토큰 콘솔 출력
  import('@/stores/fcm').then(async ({ useFcmStore }) => {
    const fcmStore = useFcmStore()
    await fcmStore.init()
    console.log('✅ Device Token:', fcmStore.token)
  })

  app.mount('#app')
})

// SW → 페이지 메시지: 토스트 + 목록 추가 + 서버 저장
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'FCM_MESSAGE') {
      const { title, body, createdAt } = event.data.payload || {}

      // 토스트
      import('@/stores/toast').then(({ useToastStore }) => {
        useToastStore().show({ title: title || '알림', body: body || '', timeout: 4000 })
      })

      // 목록 + 서버 저장
      Promise.all([import('@/stores/notification'), import('@/api/notification')]).then(
        ([{ useNotificationStore }]) => {
          const nStore = useNotificationStore()
          nStore.add({ title, body, createdAt })
          nStore.refreshSoon()
        },
      )
    }
  })
}
