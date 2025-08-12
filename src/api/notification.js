import api from '@/libs/axios'

// 알림 목록 조회
export const getNotifications = async () => {
  const res = await api.get('/api/notifications')
  return res.data
}

// 특정 알림 읽음 처리
export const markNotificationRead = async (notificationId) => {
  const res = await api.put(`/api/notifications/${notificationId}/read`)
  return res.data
}

// 모든 알림 읽음 처리
export const markAllRead = async () => {
  const res = await api.put('/api/notifications/read-all')
  return res.data
}

// FCM 푸시 메시지 전송
export const sendFcmPushMessage = async (payload) => {
  const res = await api.post('/fcm/pushMessage', payload)
  return res.data
}
