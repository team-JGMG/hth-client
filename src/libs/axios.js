import axios from 'axios'
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ .env에서 가져옴
  timeout: 10000,
  withCredentials: true, // 쿠키 포함
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청시 ac cessToken 자동 주입
api.interceptors.request.use((config) => {
  // accessToken이 필요 없는 엔드포인트
  const noAuthUrls = [
    '/api/auth/signup', // 회원가입
  ]

  // 현재 요청 URL이 noAuthUrls에 없을 때만 accessToken 추가
  if (!noAuthUrls.some((url) => config.url.includes(url))) {
    const token = localStorage.getItem('accessToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
  } else {
    // 혹시 남아있는 Authorization 헤더 제거
    delete config.headers.Authorization
  }

  return config
})

export default api
