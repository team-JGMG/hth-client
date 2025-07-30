import { computed, ref } from 'vue'

import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const savedToken = localStorage.getItem('authToken')
  const userName = ref('')
  const userPoints = ref(0)
  const authToken = ref(savedToken || '')

  const getIsLoggedIn = computed(() => !!authToken.value)

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
    getIsLoggedIn,
    setUserName,
    setUserPoints,
    setAuthToken,
    clearUserData,
  }
})
