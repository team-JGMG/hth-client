import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { refreshAccessToken } from '@/api/auth'

const api = axios.create({
  baseURL: 'https://half-to-half.site/api',
  withCredentials: true,
})

// ✅ 백엔드 꺼졌을 때 모든 요청을 무시하고 빈 응답 반환
api.interceptors.request.use((config) => {
  console.warn('[axios] 백엔드 꺼짐 - 요청 차단됨:', config.url)
  return Promise.reject({ message: '개발 모드 - 요청 차단됨' }) // 요청 자체 거부
})
//여기 백엔드 서버 꺼졌을 때..

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await refreshAccessToken()
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        const authStore = useAuthStore()
        authStore.setTokens(data.accessToken, data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return api(originalRequest)
      } catch (err) {
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/auth/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  },
)

export default api
