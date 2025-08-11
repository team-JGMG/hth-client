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

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || payload?.data?.title || '알림'

  const body = payload?.notification?.body || payload?.data?.body || ''

  const icon =
    payload?.notification?.icon ||
    'https://firebase.google.com/images/brand-guidelines/logo-logomark.png'

  const url = payload?.data?.url || '/'

  self.registration.showNotification(title, {
    body,
    icon,
    data: { url },
  })
})

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
