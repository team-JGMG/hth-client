import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userName = ref('')
  const authToken = ref(localStorage.getItem('authToken') || null)

  function setUserName(name) {
    userName.value = name
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
    setAuthToken(null)
  }

  return {
    userName,
    authToken,
    setUserName,
    setAuthToken,
    clearUserData,
  }
})
