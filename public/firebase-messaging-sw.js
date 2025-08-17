/* eslint-disable no-undef */
/* eslint-env serviceworker */
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

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

messaging.onBackgroundMessage(async (payload) => {
  const d = payload?.data || {}
  const title = d.title || '알림'
  const body = d.body || ''
  const url = d.url || '/'

  const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  clientsList.forEach((client) => {
    client.postMessage({ type: 'FCM_MESSAGE', payload: { title, body, url } })
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
