/* eslint-disable no-undef */
/* eslint-env serviceworker */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

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

messaging.onBackgroundMessage(async (payload) => {
  const title = payload?.data?.title || payload?.notification?.title || '알림'
  const body = payload?.data?.body || payload?.notification?.body || ''
  const createdAt = payload?.data?.createdAt || new Date().toISOString()

  const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const visibleClient = clientList.find((c) => c.visibilityState === 'visible')

  if (visibleClient) {
    // 페이지가 보이는 중이면 페이지로 전달 → 페이지가 토스트+목록/서버 저장 처리
    visibleClient.postMessage({ type: 'FCM_MESSAGE', payload: { title, body, createdAt } })
    return
  }

  // 보이지 않으면 OS 알림
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    data: { url: payload?.data?.url || '/', createdAt },
  })
})

self.addEventListener('notificationclick', (event) => {
  const url = event.notification?.data?.url || '/'
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const page = list.find((c) => c.url.includes(self.location.origin))
      if (page) return page.focus().then(() => page.navigate(url))
      return clients.openWindow(url)
    }),
  )
})
