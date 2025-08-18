import api from '@/libs/axios'

export const getNotifications = async (params = {}) => {
  const { page = 0, size = 20, readStatus } = params
  const res = await api.get('/api/auth/notifications', {
    params: { page, size, ...(readStatus ? { readStatus } : {}) },
  })
  return res.data
}

export const markNotificationRead = async (notificationId) => {
  const res = await api.patch(`/api/auth/notifications/${notificationId}`)
  return res.data
}

export const markAllRead = async () => {
  const res = await api.patch('/api/auth/notifications/read-all')
  return res.data
}

export const sendFcmPushMessage = async (payload) => {
  const res = await api.post('/fcm/pushMessage', payload)
  return res.data
}
