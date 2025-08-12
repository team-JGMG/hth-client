// 로그인용 api
// src/api/auth.js

import api from '@/libs/axios'

// 카카오 로그인 URL 요청
export const getKakaoLoginUrl = async () => {
  const response = await api.get('/api/auth/login/kakao', {
    withCredentials: true,
  })
  return response.data
}

// 회원가입 요청 (preauthToken 쿠키 사용)
export const signUpWithPreAuth = async (userInfo) => {
  return api.post('/api/auth/signup', userInfo, {
    withCredentials: true,
  })
}

// 토큰 갱신
export const refreshAccessToken = async () => {
  return api.post('/api/auth/oauth/token-refresh')
}

// 로그아웃 요청
export const logout = async () => {
  return api.post('/api/auth/oauth/logout')
}

// 유저 정보 요청
export const fetchUserInfo = async () => {
  return api.get('/api/users/me', { withCredentials: true })
}

/**
 * 디바이스 토큰 등록/갱신
 * @param {number|string} userId
 * @param {string} deviceToken
 * @returns {Promise<{code:string, data:any, message:string, status:string}>}
 */
export const registerDeviceToken = async (userId, deviceToken) => {
  const res = await api.post(`/api/users/${encodeURIComponent(userId)}/device-token`, {
    deviceToken,
  })
  return res.data
}
