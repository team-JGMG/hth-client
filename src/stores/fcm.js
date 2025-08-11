import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

import { defineStore } from 'pinia'
import { initializeApp } from 'firebase/app'
import { useNotificationStore } from '@/stores/notification'
import { useToastStore } from '@/stores/toast'

const firebaseConfig = {
  apiKey: 'AIzaSyBlGyTkWCcpa5wBnilUyuKq0aLnzVrOEnU',
  authDomain: 'half-to-half.firebaseapp.com',
  projectId: 'half-to-half',
  storageBucket: 'half-to-half.firebasestorage.app',
  messagingSenderId: '901490480152',
  appId: '1:901490480152:web:8b80dc3923fb3b7be81f6d',
  measurementId: 'G-CNNPB8N62Y',
}
const VAPID_PUBLIC_KEY =
  'BDQGH97rGd2TYNHX40Cw392hDAkQO139lLlEjMHQP9T55Cq3Vifi4BGgddISfPQEa9NxRFlTYV20ssiJHOGewkU'

const app = initializeApp(firebaseConfig)
const LAST_REG_KEY = 'fcm:lastReg' // { uid, token }

export const useFcmStore = defineStore('fcm', {
  state: () => ({
    supported: true,
    permission: 'default',
    token: '',
    lastMessage: null,
  }),
  actions: {
    async init() {
      if (typeof window === 'undefined') return

      // 지원 여부
      this.supported = await isSupported().catch(() => false)
      if (!this.supported) return

      // SW 등록
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

      // 권한
      this.permission =
        Notification.permission === 'default'
          ? await Notification.requestPermission()
          : Notification.permission
      if (this.permission !== 'granted') return

      // 토큰 발급
      const messaging = getMessaging(app)
      try {
        this.token = await getToken(messaging, {
          vapidKey: VAPID_PUBLIC_KEY,
          serviceWorkerRegistration: reg,
        })
      } catch (e) {
        console.warn('[FCM] getToken 실패:', e)
        return
      }

      // 로그인된 경우에만 토큰 등록/업서트
      try {
        const [{ useAuthStore }, { registerDeviceToken }] = await Promise.all([
          import('@/stores/authStore'),
          import('@/api/auth'),
        ])
        const auth = useAuthStore()
        const uid = auth.userInfo?.userId
        if (uid && this.token) {
          const last = JSON.parse(localStorage.getItem(LAST_REG_KEY) || 'null')
          if (!last || last.uid !== uid || last.token !== this.token) {
            await registerDeviceToken(uid, this.token) // POST /api/users/{uid}/device-token
            localStorage.setItem(LAST_REG_KEY, JSON.stringify({ uid, token: this.token }))
          }
        }
      } catch (e) {
        console.warn('[FCM] 토큰 등록 실패:', e)
      }

      // 포그라운드 수신: 토스트 + 서버 동기화(fetch만)
      onMessage(messaging, (payload) => {
        const toast = useToastStore()
        const nStore = useNotificationStore()
        const title = payload?.data?.title || payload?.notification?.title || '알림'
        const body = payload?.data?.body || payload?.notification?.body || ''
        this.lastMessage = payload
        toast.show({ title, body, timeout: 4000 })
        nStore.refreshSoon() // 600~1000ms 후 GET /api/notifications
      })

      // SW → 페이지: 토스트 + 서버 동기화(fetch만)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type !== 'FCM_MESSAGE') return
        const toast = useToastStore()
        const nStore = useNotificationStore()
        const { title, body } = event.data.payload || {}
        toast.show({ title: title || '알림', body: body || '', timeout: 4000 })
        nStore.refreshSoon()
      })
    },
  },
})
