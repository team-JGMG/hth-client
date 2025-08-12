import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

import { defineStore } from 'pinia'
import { initializeApp } from 'firebase/app'
import router from '@/router'
import { useNotificationStore } from '@/stores/notification'
import { useToastStore } from '@/stores/toast'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const VAPID_PUBLIC_KEY = import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY
const app = initializeApp(firebaseConfig)
const LAST_REG_KEY = 'fcm:lastReg' // { uid, token }

export const useFcmStore = defineStore('fcm', {
  state: () => ({
    supported: true,
    permission: 'default',
    token: '',
    lastMessage: null,
    initialized: false,
  }),

  actions: {
    async init() {
      if (typeof window === 'undefined' || this.initialized) return

      // ✅ 로그인 상태 확인
      const { useAuthStore } = await import('@/stores/authStore')
      const auth = useAuthStore()

      if (!auth.getIsLoggedIn) {
        console.warn('[FCM] 로그인되지 않음 - FCM 초기화 건너뜀')
        return
      }

      try {
        console.log('[FCM] 초기화 시작 (로그인된 상태)')

        // 지원 여부
        this.supported = await isSupported().catch(() => false)
        if (!this.supported) {
          console.warn('[FCM] 브라우저에서 지원되지 않음')
          return
        }

        // SW 등록
        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        console.log('[FCM] Service Worker 등록 완료')

        // 권한 요청
        this.permission =
          Notification.permission === 'default'
            ? await Notification.requestPermission()
            : Notification.permission

        if (this.permission !== 'granted') {
          console.warn('[FCM] 알림 권한이 없음:', this.permission)
          return
        }

        // 토큰 발급 (로그인된 상태에서만)
        const messaging = getMessaging(app)
        try {
          this.token = await getToken(messaging, {
            vapidKey: VAPID_PUBLIC_KEY,
            serviceWorkerRegistration: reg,
          })
          console.log('[FCM] 토큰 발급 완료:', this.token)

          // 토큰 서버 등록
          await this.registerToken(auth.userInfo.userId)
        } catch (e) {
          console.warn('[FCM] getToken 실패:', e)
          return
        }

        // 메시지 리스너 설정
        this.setupForegroundListener(messaging)
        this.setupServiceWorkerListener()

        this.initialized = true
        console.log('[FCM] 초기화 완료')
      } catch (error) {
        console.error('[FCM] 초기화 실패:', error)
        throw error
      }
    },

    async registerToken(userId) {
      if (!userId || !this.token) {
        console.warn('[FCM] userId 또는 token이 없음')
        return
      }

      try {
        const { registerDeviceToken } = await import('@/api/auth')
        const last = JSON.parse(localStorage.getItem(LAST_REG_KEY) || 'null')

        if (!last || last.uid !== userId || last.token !== this.token) {
          console.log('[FCM] registerDeviceToken 요청', {
            uid: userId,
            token: this.token,
          })

          const res = await registerDeviceToken(this.token) // POST /api/auth/device-tokens

          // ✅ 콘솔 추가 - 요청 후
          console.log('[FCM] registerDeviceToken 응답', res)

          localStorage.setItem(
            LAST_REG_KEY,
            JSON.stringify({
              uid: userId,
              token: this.token,
            }),
          )
        } else {
          console.log('[FCM] 토큰이 이미 등록됨 - 건너뜀')
        }
      } catch (e) {
        console.warn('[FCM] 토큰 등록 실패:', e)
        throw e
      }
    },

    setupForegroundListener(messaging) {
      onMessage(messaging, (payload) => {
        console.log('[FCM] 포그라운드 메시지 수신:', payload)

        const toast = useToastStore()
        const nStore = useNotificationStore()
        const title = payload?.data?.title || payload?.notification?.title || '알림'
        const body = payload?.data?.body || payload?.notification?.body || ''

        this.lastMessage = payload
        toast.show({ title, body, timeout: 4000 })
        nStore.refreshSoon()
      })
    },

    setupServiceWorkerListener() {
      if ('serviceWorker' in navigator) {
        // ✅ 이미 리스너가 등록되었는지 확인
        if (window._fcmSWListenerRegistered) {
          console.log('[FCM] SW 리스너 이미 등록됨 - 건너뜀')
          return
        }

        navigator.serviceWorker.addEventListener('message', async (event) => {
          const type = event?.data?.type
          const payload = event?.data?.payload || {}
          const title = payload?.title || '알림'
          const body = payload?.body || ''
          const url = payload?.url || event?.data?.url || '/'

          console.log('[FCM] SW 메시지 수신:', { type, payload })

          try {
            const nStore = useNotificationStore()
            const toast = useToastStore()

            switch (type) {
              // SW에서 브로드캐스트한 일반 수신
              case 'FCM_MESSAGE': {
                toast.show({ title, body, timeout: 4000 })
                nStore.refreshSoon()
                break
              }
              // 사용자가 시스템 알림을 클릭했을 때
              case 'FCM_MESSAGE_CLICKED': {
                try {
                  await router.push(url)
                } catch {
                  window.location.href = url
                }
                nStore.refreshSoon()
                break
              }
              default:
                break
            }
          } catch (e) {
            console.warn('[SW message handler] 처리 실패:', e)
          }
        })

        // ✅ 중복 등록 방지 플래그
        window._fcmSWListenerRegistered = true
        console.log('[FCM] SW 리스너 등록 완료')
      }
    },

    // 로그아웃 시 초기화 상태 리셋
    reset() {
      console.log('[FCM] 상태 리셋 (로그아웃)')
      this.initialized = false
      this.token = ''
      this.lastMessage = null
      this.permission = 'default'
      localStorage.removeItem(LAST_REG_KEY)
      // SW 리스너 플래그도 리셋하지 않음 (한번 등록되면 계속 사용)
    },

    // 로그인 후 FCM 재초기화
    async reinitialize() {
      this.reset()
      await this.init()
    },
  },
})
