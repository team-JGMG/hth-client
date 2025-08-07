// src/api/auth.js

import api from '@/libs/axios'

// ✅ 로그인은 axios로 하지 않고, 직접 브라우저에서 리다이렉트하므로 이 함수는 제거 가능
// export const getKakaoLoginUrl = async () => { ... }

// ✅ 회원가입 요청 (preauthToken 쿠키 사용)
export const signUpWithPreAuth = async (userInfo) => {
  return api.post('/auth/signup', userInfo, {
    withCredentials: true,
  })
}

export const refreshAccessToken = async () => {
  return api.post('/auth/oauth/token-refresh')
}

export const logout = async () => {
  return api.post('/auth/oauth/logout')
}

export const fetchUserInfo = async () => {
  return api.get('/users/me')
}
