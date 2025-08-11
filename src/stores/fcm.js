import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging'

import { defineStore } from 'pinia'
import { initializeApp } from 'firebase/app'
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
      this.supported = await isSupported().catch(() => false)
      if (!this.supported) return

      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      this.permission = await Notification.requestPermission()
      if (this.permission !== 'granted') return

      const messaging = getMessaging(app)
      this.token = await getToken(messaging, {
        vapidKey: VAPID_PUBLIC_KEY,
        serviceWorkerRegistration: reg,
      })

      // ✅ 포그라운드 수신 → 토스트로 표시 + 알림 목록 갱신
      onMessage(messaging, (payload) => {
        const toast = useToastStore()
        const title = payload?.data?.title || payload?.notification?.title || '알림'
        const body = payload?.data?.body || payload?.notification?.body || ''
        this.lastMessage = payload
        toast.show({ title, body, timeout: 4000 })

        // 🔁 알림 목록 새로고침 (디바운스 적용)
        import('@/stores/notification').then(({ useNotificationStore }) => {
          const n = useNotificationStore()
          n.refreshSoon()
        })
      })
    },
  },
})
