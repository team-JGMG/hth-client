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
const LAST_REG_KEY = 'fcm:lastReg'

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

      const { useAuthStore } = await import('@/stores/authStore')
      const auth = useAuthStore()

      if (!auth.getIsLoggedIn) {
        return
      }

      try {
        this.supported = await isSupported().catch(() => false)
        if (!this.supported) {
          return
        }

        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

        this.permission =
          Notification.permission === 'default'
            ? await Notification.requestPermission()
            : Notification.permission

        if (this.permission !== 'granted') {
          return
        }

        const messaging = getMessaging(app)
        try {
          this.token = await getToken(messaging, {
            vapidKey: VAPID_PUBLIC_KEY,
            serviceWorkerRegistration: reg,
          })

          await this.registerToken(auth.userInfo.userId)
        } catch {
          return
        }

        this.setupForegroundListener(messaging)
        this.setupServiceWorkerListener()

        this.initialized = true
      } catch {
        throw new Error()
      }
    },

    async registerToken(userId) {
      if (!userId || !this.token) {
        return
      }

      try {
        const { registerDeviceToken } = await import('@/api/auth')
        const last = JSON.parse(localStorage.getItem(LAST_REG_KEY) || 'null')

        if (!last || last.uid !== userId || last.token !== this.token) {
          await registerDeviceToken(this.token)

          localStorage.setItem(
            LAST_REG_KEY,
            JSON.stringify({
              uid: userId,
              token: this.token,
            }),
          )
        }
      } catch {
        throw new Error()
      }
    },

    setupForegroundListener(messaging) {
      onMessage(messaging, (payload) => {
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
        if (window._fcmSWListenerRegistered) {
          return
        }

        navigator.serviceWorker.addEventListener('message', async (event) => {
          const type = event?.data?.type
          const payload = event?.data?.payload || {}
          const title = payload?.title || '알림'
          const body = payload?.body || ''
          const url = payload?.url || event?.data?.url || '/'

          try {
            const nStore = useNotificationStore()
            const toast = useToastStore()

            switch (type) {
              case 'FCM_MESSAGE': {
                toast.show({ title, body, timeout: 4000 })
                nStore.refreshSoon()
                break
              }
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
          } catch {
            //
          }
        })

        window._fcmSWListenerRegistered = true
      }
    },

    reset() {
      this.initialized = false
      this.token = ''
      this.lastMessage = null
      this.permission = 'default'
      localStorage.removeItem(LAST_REG_KEY)
    },

    async reinitialize() {
      this.reset()
      await this.init()
    },
  },
})
