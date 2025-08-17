import api from '@/libs/axios'

export const getKakaoLoginUrl = async () => {
  const response = await api.get('/api/auth/login/kakao', {
    withCredentials: true,
  })
  return response.data
}

export const signUpWithPreAuth = async (userInfo) => {
  return api.post('/api/signup', userInfo, {
    withCredentials: true,
  })
}

export const refreshAccessToken = async () => {
  return api.post('/api/auth/token-refresh')
}

export const logout = async (deviceToken) => {
  return api.post('/api/auth/logout', { deviceToken })
}

export const fetchUserInfo = async () => {
  return api.get('/api/auth/users/me', { withCredentials: true })
}

/**
 * @param {number|string} userId
 * @param {string} deviceToken
 * @returns {Promise<{code:string, data:any, message:string, status:string}>}
 */
export const registerDeviceToken = async (deviceToken) => {
  const res = await api.post(`/api/auth/device-tokens`, {
    deviceToken,
  })
  return res.data
}
