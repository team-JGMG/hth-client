// // src/api/auth.js

// import axios from 'axios'
// import api from '@/libs/axios'

// const BASE_URL = 'https://half-to-half.site/api'

// // ✅ 카카오 로그인 URL 요청
// export const getKakaoLoginUrl = async () => {
//   return axios.get(`${BASE_URL}/auth/login/kakao`)
// }

// // ✅ 회원가입 요청
// export const signUpWithPreAuth = async (userInfo) => {
//   return axios.post(`${BASE_URL}/auth/signup`, userInfo, {
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     withCredentials: true,
//   })
// }

// // ✅ 토큰 갱신
// export const refreshAccessToken = async () => {
//   return axios.post(`${BASE_URL}/auth/oauth/token-refresh`, null, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//     },
//     withCredentials: true,
//   })
// }

// // ✅ 로그아웃 요청
// export const logout = async () => {
//   return api.post('/auth/oauth/logout')
// }

// // ✅ 유저 정보 요청
// export const fetchUserInfo = async () => {
//   return api.get('/auth/me')
// }

// src/api/auth.js

import api from '@/libs/axios'
import axios from 'axios' // 💡 기본 인스턴스
// ✅ 카카오 로그인 URL 요청

export const getKakaoLoginUrl = async () => {
  const response = await axios.get('http://localhost:8080/api/auth/login/kakao')
  return response.data.data.loginUrl // 적절한 key로 변경
}
// ✅ 회원가입 요청
// ✅ Authorization 헤더 제거
export const signUpWithPreAuth = async (userInfo) => {
  return axios.post('http://localhost:8080/api/auth/signup', userInfo, {
    withCredentials: true, // ✅ 반드시 설정
  })
}

// ✅ 토큰 갱신
export const refreshAccessToken = async () => {
  return api.post('/auth/oauth/token-refresh')
}

// ✅ 로그아웃 요청
export const logout = async () => {
  return api.post('/auth/oauth/logout')
}

// ✅ 유저 정보 요청
export const fetchUserInfo = async () => {
  return api.get('/auth/me')
}
