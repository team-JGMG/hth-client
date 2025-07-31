// // src/api/auth.js
// import axios from 'axios'
// // src/api/auth.js
// import api from '@/utils/axios'
// const BASE_URL = 'https://half-to-half.site/api'

// export const getKakaoLoginUrl = async () => {
//   return axios.get(`${BASE_URL}/auth/login/kakao`)
// }

// export const signUpWithPreAuth = async (userInfo) => {
//   return axios.post(`${BASE_URL}/auth/signup`, userInfo, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     withCredentials: true, // 쿠키(preAuthToken) 자동 전송
//   })
// }
// export const refreshAccessToken = async () => {
//   return axios.post(`${BASE_URL}/auth/oauth/token-refresh`, null, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//     },
//     withCredentials: true, // 쿠키에 accessToken이 있는 경우를 위해
//   })
// }
// export const logout = async () => {
//   return api.post('/auth/oauth/logout')
// }
// await logout()
// authStore.logout()
// router.push('/auth/login')

// export const fetchUserInfo = async () => {
//   return api.get('/auth/me') // 실제 경로는 백엔드에 맞춰 수정
// }

// src/api/auth.js

// [!] 실제 서버로 요청 보내지 않음. mock 응답 반환
const dummyUser = {
  name: '홍길동',
  email: 'test@example.com',
}

// ✅ 카카오 로그인 URL 요청 (사용 안 하더라도 형식 유지)
export const getKakaoLoginUrl = async () => {
  console.log('[MOCK] getKakaoLoginUrl 호출됨')
  return Promise.resolve({ data: { url: 'https://mock-kakao-login.url' } })
}

// ✅ 회원가입 처리 mock
export const signUpWithPreAuth = async (userInfo) => {
  console.log('[MOCK] 회원가입 요청됨:', userInfo)
  return Promise.resolve({
    data: {
      accessToken: 'MOCK_ACCESS_TOKEN',
      refreshToken: 'MOCK_REFRESH_TOKEN',
    },
  })
}

// ✅ 토큰 리프레시 mock
export const refreshAccessToken = async () => {
  console.log('[MOCK] refreshAccessToken 호출됨')
  return Promise.resolve({
    data: {
      accessToken: 'MOCK_NEW_ACCESS_TOKEN',
      refreshToken: 'MOCK_NEW_REFRESH_TOKEN',
    },
  })
}

// ✅ 로그아웃 처리 mock
export const logout = async () => {
  console.log('[MOCK] logout 호출됨')
  return Promise.resolve()
}

// ✅ 사용자 정보 요청 mock
export const fetchUserInfo = async () => {
  console.log('[MOCK] fetchUserInfo 호출됨')
  return Promise.resolve({
    data: dummyUser,
  })
}
