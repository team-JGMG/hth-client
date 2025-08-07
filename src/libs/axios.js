import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ .env에서 가져옴
  timeout: 10000,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 시 accessToken 자동 주입
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
