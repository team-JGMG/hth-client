import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 가상 유저
  const userName = ref('투슬리스')
  const userPoints = ref(100000)
  const authToken = ref('mock_token')

  function setUserName(name) {
    userName.value = name
  }

  function setUserPoints(points) {
    userPoints.value = points
  }

  function setAuthToken(token) {
    authToken.value = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  function clearUserData() {
    userName.value = ''
    userPoints.value = 0
    setAuthToken(null)
  }

  return {
    userName,
    userPoints,
    authToken,
    setUserName,
    setUserPoints,
    setAuthToken,
    clearUserData,
  }
})
