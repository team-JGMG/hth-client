// src/api/notification.js
import api from '@/libs/axios'

// 공통 언래퍼: 서버 응답이 { status, data } 구조이므로 data만 반환
const unwrap = (res) => (res?.data !== undefined ? res.data.data : null)

// 알림 목록 조회
export const getNotifications = async () => {
  const res = await api.get('/api/notifications')
  console.log('[REQ]', res.config.baseURL, res.config.url, res.config.headers?.Authorization)

  // ✅ 원본 응답 그대로 찍기
  console.group('[API] /api/notifications 응답')
  console.log('전체 응답 객체:', res)
  console.log('res.data:', res.data)
  console.log('res.data.data:', res.data?.data)

  // data 배열이면 표로 출력
  if (Array.isArray(res.data?.data)) {
    console.table(res.data.data)
  }
  console.groupEnd()

  return Array.isArray(res.data?.data) ? res.data.data : []
}

// 단건 읽음 처리
export const markNotificationRead = async (id) => {
  const res = await api.patch(`/api/notifications/${id}/read`)
  return unwrap(res) // 필요 시 true/updated object 등 서버 값 사용
}

// 전체 읽음 처리
export const markAllRead = async () => {
  const res = await api.post('/api/notifications/read-all')
  return unwrap(res)
}
