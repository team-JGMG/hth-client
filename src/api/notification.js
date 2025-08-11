import api from '@/libs/axios'

const unwrap = (res) => (res?.data !== undefined ? res.data.data : null)

// ✅ 서버에 알림 저장
export const createNotification = async ({ title, body, createdAt }) => {
  const res = await api.post('/api/notifications', { title, body, createdAt })
  return unwrap(res)
}

// 알림 목록 조회
export const getNotifications = async () => {
  const res = await api.get('/api/notifications')
  console.log('[REQ]', res.config.baseURL, res.config.url, res.config.headers?.Authorization)

  console.group('[API] /api/notifications 응답')
  console.log('전체 응답 객체:', res)
  console.log('res.data:', res.data)
  console.log('res.data.data:', res.data?.data)
  if (Array.isArray(res.data?.data)) console.table(res.data.data)
  console.groupEnd()

  return Array.isArray(res.data?.data) ? res.data.data : []
}

// 단건 읽음 처리
export const markNotificationRead = async (id) => {
  const res = await api.patch(`/api/notifications/${id}/read`)
  return unwrap(res)
}

// 전체 읽음 처리
export const markAllRead = async () => {
  const res = await api.post('/api/notifications/read-all')
  return unwrap(res)
}
