// src/api/auth.js

import api from '@/libs/axios'
import axios from 'axios'
// ✅ 카카오 로그인 URL 요청
export const getKakaoLoginUrl = async () => {
  const response = await axios.get('http://localhost:8080/api/auth/login/kakao', {
    withCredentials: true,
  })
  return response.data
}
// ✅ 회원가입 요청 (preauthToken 쿠키 사용)
export const signUpWithPreAuth = async (userInfo) => {
  return api.post('/api/auth/signup', userInfo, {
    withCredentials: true,
  })
}

// ✅ 토큰 갱신
export const refreshAccessToken = async () => {
  return api.post('/api/auth/oauth/token-refresh') // api 인스턴스 사용
}

// ✅ 로그아웃 요청
export const logout = async () => {
  return api.post('/api/auth/oauth/logout')
}

// ✅ 유저 정보 요청
export const fetchUserInfo = async () => {
  return api.get('/api/users/me') // /api 꼭 붙이기!
}

// src/api/auth.js

// import api from '@/libs/axios'
// import axios from 'axios' // 💡 기본 인스턴스
// // ✅ 카카오 로그인 URL 요청

// export const getKakaoLoginUrl = async () => {
//   const response = await axios.get('http://localhost:8080/api/auth/login/kakao')
//   return response.data.data.loginUrl // 적절한 key로 변경
// }
// // ✅ 회원가입 요청
// // ✅ Authorization 헤더 제거
// export const signUpWithPreAuth = async (userInfo) => {
//   return axios.post('http://localhost:8080/api/auth/signup', userInfo, {
//     withCredentials: true, // ✅ 반드시 설정
//   })
// }

// // ✅ 토큰 갱신
// export const refreshAccessToken = async () => {
//   return api.post('/auth/oauth/token-refresh')
// }

// // ✅ 로그아웃 요청
// export const logout = async () => {
//   return api.post('/auth/oauth/logout')
// }

// // ✅ 유저 정보 요청
// export const fetchUserInfo = async () => {
//   return api.get('/auth/me')
// }
// // ✅ 🔥 [추가] 마이페이지용 유저 상세 정보 요청 (/api/users/me)
// export const fetchMyUserInfo = async () => {
//   return api.get('/api/users/me') // 이건 인증 필요
// }
