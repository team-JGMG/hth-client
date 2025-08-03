import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { parseOrderbookData } from '@/utils/ParseOrderBookData'

export function useOrderBookSocket(fundingId, onUpdate) {
  const orderBookData = ref(null)
  let stompClient = null

  const connectWebSocket = () => {
    console.log('[WebSocket] connectWebSocket called')
    if (stompClient && stompClient.active) {
      stompClient.deactivate()
    }
    const socket = new SockJS('http://localhost:8080/order-book')
    stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log('[STOMP]', str),
      onConnect: () => {
        console.log('[WebSocket 연결됨]')

        // 1. subscribe 먼저
        stompClient.subscribe(`/topic/order-book/${fundingId}`, (message) => {
          const data = JSON.parse(message.body)
          console.log('[WebSocket 수신]', message.body)
          orderBookData.value = data
          if (onUpdate) {
            onUpdate(parseOrderbookData(data))
            console.log('📡 메시지 파싱 완료', parseOrderbookData(data))
          }
        })

        // 2. subscribe 이후에 약간의 딜레이 후 publish
        setTimeout(() => {
          stompClient.publish({
            destination: `/app/order-book/${fundingId}`,
            body: '',
          })
        }, 100)
      },
      onStompError: (frame) => console.error('[STOMP ERROR]', frame),
      onWebSocketClose: () => console.warn('[WebSocket 연결 종료]'),
    })

    stompClient.activate()
  }

  onMounted(() => {
    connectWebSocket()
  })

  onBeforeUnmount(() => {
    if (stompClient && stompClient.active) {
      stompClient.deactivate()
    }
  })

  const reconnect = () => {
    console.log('[WebSocket] Reconnecting...')
    connectWebSocket()
  }

  return {
    orderBookData,
    reconnect,
  }
}
