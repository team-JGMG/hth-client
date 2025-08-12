import './assets/main.css'
import 'v-calendar/style.css'

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
]).then(async () => {
  document.documentElement.classList.add('icons-loaded')

  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(VCalendar, {})
  app.use(pinia)
  app.use(router)

  // ✅ FCM 초기화 (권한/토큰/업서트)
  try {
    const { useFcmStore } = await import('@/stores/fcm')
    const fcmStore = useFcmStore()
    await fcmStore.init()
    console.log('✅ Device Token:', fcmStore.token)
  } catch (e) {
    console.warn('[FCM] init 실패:', e)
  }

  app.mount('#app')
})

// ✅ SW → 페이지 메시지 통합 처리 (포그라운드/백그라운드 공통)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', async (event) => {
    const type = event?.data?.type
    const payload = event?.data?.payload || {}
    const title = payload?.title || '알림'
    const body = payload?.body || ''
    const url = payload?.url || event?.data?.url || '/'

    try {
      const [{ useNotificationStore }, { useToastStore }] = await Promise.all([
        import('@/stores/notification'),
        import('@/stores/toast'),
      ])
      const nStore = useNotificationStore()
      const toast = useToastStore()

      switch (type) {
        // SW에서 브로드캐스트한 일반 수신
        case 'FCM_MESSAGE': {
          // 토스트만 띄우고 서버 목록은 디바운스 fetch
          toast.show({ title, body, timeout: 4000 })
          nStore.refreshSoon()
          break
        }
        // 사용자가 시스템 알림을 클릭했을 때
        case 'FCM_MESSAGE_CLICKED': {
          // 라우터 이동(없으면 location.href)
          try {
            // 전역 router 인스턴스 사용
            await router.push(url)
          } catch {
            window.location.href = url
          }
          // 이동 후 목록 동기화
          nStore.refreshSoon()
          break
        }
        default:
          // 기타 메시지는 무시
          break
      }
    } catch (e) {
      console.warn('[SW message handler] 처리 실패:', e)
    }
  })
}
