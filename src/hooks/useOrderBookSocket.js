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
    console.log('[WebSocket] connectWebSocket called for fundingId:', fundingId)

    // 기존 연결 정리
    cleanup()

    try {
      const socket = new SockJS('https://half-to-half.site/order-book')
      const token = localStorage.getItem('accessToken')
      console.log('🔑 토큰 확인:', token ? '있음' : '없음')

      stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 3000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          // STOMP 디버그 로그 필터링 (너무 많으면 주석 처리)
          if (str.includes('CONNECTED') || str.includes('MESSAGE') || str.includes('ERROR')) {
            console.log('[STOMP]', str)
          }
        },
        onConnect: (frame) => {
          console.log('✅ [WebSocket 연결 성공]', frame)
          isConnected.value = true

          // 구독 설정
          const topic = `/topic/order-book/${fundingId}`
          console.log('📡 구독 시작:', topic)

          subscription = stompClient.subscribe(topic, (message) => {
            console.log('📨 [WebSocket 메시지 수신]', new Date().toLocaleTimeString())
            console.log('원본 데이터:', message.body)

            try {
              const rawData = JSON.parse(message.body)
              const parsedData = parseOrderbookData(rawData)

              orderBookData.value = rawData
              lastMessageTime.value = new Date().toLocaleTimeString()

              if (onUpdate) {
                console.log('🔄 onUpdate 콜백 실행')
                onUpdate(parsedData)
              }
            } catch (error) {
              console.error('❌ 메시지 파싱 실패:', error)
            }
          })

          // 구독 완료 후 서버에 데이터 요청
          setTimeout(() => {
            const destination = `/app/order-book/${fundingId}`
            console.log('📤 서버에 데이터 요청:', destination)

            try {
              stompClient.publish({
                destination,
                body: JSON.stringify({ fundingId }),
              })
            } catch (error) {
              console.error('❌ 메시지 발송 실패:', error)
            }
          }, 200)

          // 하트비트 설정
          startHeartbeat()
        },

        onStompError: (frame) => {
          console.error('❌ [STOMP ERROR]', frame)
          isConnected.value = false
          scheduleReconnect()
        },

        onWebSocketClose: (event) => {
          console.warn('⚠️ [WebSocket 연결 종료]', event)
          isConnected.value = false
          scheduleReconnect()
        },

        onWebSocketError: (error) => {
          console.error('❌ [WebSocket 에러]', error)
          isConnected.value = false
        },
      })

      stompClient.activate()
    } catch (error) {
      console.error('❌ WebSocket 연결 실패:', error)
      scheduleReconnect()
    }
  }

  const cleanup = () => {
    // 기존 타이머들 정리
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }

    // 구독 해제
    if (subscription) {
      try {
        subscription.unsubscribe()
      } catch (error) {
        console.warn('구독 해제 실패:', error)
      }
      subscription = null
    }

    // STOMP 연결 해제
    if (stompClient && stompClient.active) {
      try {
        stompClient.deactivate()
      } catch (error) {
        console.warn('STOMP 연결 해제 실패:', error)
      }
    }
    stompClient = null
    isConnected.value = false
  }

  const scheduleReconnect = () => {
    if (reconnectTimer) return // 이미 재연결이 예정되어 있음

    console.log('🔄 3초 후 재연결 시도...')
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
        } catch (error) {
          console.warn('하트비트 전송 실패:', error)
        }
      }
    }, 30000) // 30초마다
  }

  const reconnect = () => {
    console.log('🔄 [수동 재연결 요청]')
    cleanup()
    connectWebSocket()
  }

  // fundingId 변경 시 재연결
  watch(
    () => fundingId,
    (newId, oldId) => {
      if (newId !== oldId) {
        console.log('🔄 fundingId 변경으로 재연결:', oldId, '->', newId)
        reconnect()
      }
    },
  )

  onMounted(() => {
    console.log('🚀 useOrderBookSocket 마운트됨')
    connectWebSocket()
  })

  onBeforeUnmount(() => {
    console.log('🔚 useOrderBookSocket 언마운트됨')
    cleanup()
  })

  return {
    orderBookData,
    isConnected,
    lastMessageTime,
    reconnect,
  }
}
