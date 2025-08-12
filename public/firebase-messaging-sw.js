/* eslint-disable no-undef */
/* eslint-env serviceworker */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

// 🔁 버전 올려 캐시 무효화
self.SW_VERSION = 'v3'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

firebase.initializeApp({
  apiKey: 'AIzaSyBlGyTkWCcpa5wBnilUyuKq0aLnzVrOEnU',
  authDomain: 'half-to-half.firebaseapp.com',
  projectId: 'half-to-half',
  storageBucket: 'half-to-half.firebasestorage.app',
  messagingSenderId: '901490480152',
  appId: '1:901490480152:web:8b80dc3923fb3b7be81f6d',
  measurementId: 'G-CNNPB8N62Y',
})

const messaging = firebase.messaging()

// ✅ 배경 수신: 시스템 푸시 ❌, 열린 탭에만 브로드캐스트 ⭕
messaging.onBackgroundMessage(async (payload) => {
  const d = payload?.data || {}
  const title = d.title || '알림'
  const body = d.body || ''
  const url = d.url || '/'

  const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  clientsList.forEach((client) => {
    client.postMessage({ type: 'FCM_MESSAGE', payload: { title, body, url } })
  })

  // (옵션) 특정 케이스만 배너 허용하고 싶으면:
  // if (d.fallback === 'push') {
  //   self.registration.showNotification(title, { body, data: { url } })
  // }
})

// (알림 배너를 띄우지 않으면 클릭 핸들러는 보통 필요 없음. fallback 쓰면 유지)
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification?.data?.url || '/'
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const client = allClients.find((c) => c.url.includes(self.location.origin))
      if (client) {
        client.focus()
        client.postMessage({ type: 'FCM_MESSAGE_CLICKED', url })
      } else {
        await self.clients.openWindow(url)
      }
    })(),
  )
})
