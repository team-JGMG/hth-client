import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { parseOrderbookData } from '@/utils/ParseOrderBookData'

export function useOrderBookSocket(fundingId, onUpdate) {
  const orderBookData = ref(null)
  const isConnected = ref(false)
  const lastMessageTime = ref(null)

  let stompClient = null
  let subscription = null
  let reconnectTimer = null
  let heartbeatTimer = null

  const connectWebSocket = () => {
    cleanup()

    try {
      const socket = new SockJS('https://half-to-half.site/order-book')
      const token = localStorage.getItem('accessToken')

      stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          isConnected.value = true

          const topic = `/topic/order-book/${fundingId}`

          subscription = stompClient.subscribe(topic, (message) => {
            try {
              const rawData = JSON.parse(message.body)
              const parsedData = parseOrderbookData(rawData)

              orderBookData.value = rawData
              lastMessageTime.value = new Date().toLocaleTimeString()

              if (onUpdate) {
                onUpdate(parsedData)
              }
            } catch {
              //
            }
          })

          setTimeout(() => {
            const destination = `/app/order-book/${fundingId}`

            try {
              stompClient.publish({
                destination,
                body: JSON.stringify({ fundingId }),
              })
            } catch {
              //
            }
          }, 200)

          startHeartbeat()
        },

        onStompError: () => {
          isConnected.value = false
          scheduleReconnect()
        },

        onWebSocketClose: () => {
          isConnected.value = false
          scheduleReconnect()
        },

        onWebSocketError: () => {
          isConnected.value = false
        },
      })

      stompClient.activate()
    } catch {
      scheduleReconnect()
    }
  }

  const cleanup = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }

    if (subscription) {
      try {
        subscription.unsubscribe()
      } catch {
        //
      }
      subscription = null
    }

    if (stompClient && stompClient.active) {
      try {
        stompClient.deactivate()
      } catch {
        //
      }
    }
    stompClient = null
    isConnected.value = false
  }

  const scheduleReconnect = () => {
    if (reconnectTimer) return

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      connectWebSocket()
    }, 3000)
  }

  const startHeartbeat = () => {
    heartbeatTimer = setInterval(() => {
      if (stompClient && stompClient.active) {
        try {
          stompClient.publish({
            destination: `/app/heartbeat`,
            body: JSON.stringify({ timestamp: Date.now() }),
          })
        } catch {
          //
        }
      }
    }, 30000)
  }

  const reconnect = () => {
    cleanup()
    connectWebSocket()
  }

  watch(
    () => fundingId,
    (newId, oldId) => {
      if (newId !== oldId) {
        reconnect()
      }
    },
  )

  onMounted(() => {
    connectWebSocket()
  })

  onBeforeUnmount(() => {
    cleanup()
  })

  return {
    orderBookData,
    isConnected,
    lastMessageTime,
    reconnect,
  }
}
