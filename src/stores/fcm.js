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

      // ✅ 포그라운드 수신: 토스트 + 목록 추가 + 서버 저장
      onMessage(messaging, async (payload) => {
        const toast = useToastStore()
        const nStore = useNotificationStore()

        const title = payload?.data?.title || payload?.notification?.title || '알림'
        const body = payload?.data?.body || payload?.notification?.body || ''
        const createdAt = payload?.data?.createdAt || new Date().toISOString()

        this.lastMessage = payload

        // 1) 즉시 UI 반영
        nStore.add({ title, body, createdAt })
        toast.show({ title, body, timeout: 4000 })

        // 2) 서버 저장 + 동기화
        try {
          nStore.refreshSoon()
        } catch (e) {
          console.warn('[FCM] 서버 저장 실패:', e)
        }
      })

      // ✅ 백그라운드 수신(페이지 열려있을 때): 토스트 + 목록 추가 + 서버 저장
      navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data?.type !== 'FCM_MESSAGE') return

        const toast = useToastStore()
        const nStore = useNotificationStore()
        const { title, body, createdAt } = event.data.payload

        // 1) 즉시 UI 반영
        nStore.add({ title, body, createdAt })
        toast.show({ title, body, timeout: 4000 })

        // 2) 서버 저장 + 동기화
        try {
          nStore.refreshSoon()
        } catch (e) {
          console.warn('[FCM] 서버 저장 실패:', e)
        }
      })
    },
  },
})
