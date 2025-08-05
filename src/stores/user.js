import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const savedToken = localStorage.getItem('authToken')
  const authToken = ref(savedToken || '')

  const userInfo = ref(null) // 🔥 전체 유저 정보 저장
  const userName = computed(() => userInfo.value?.name || '')
  const userPoints = computed(() => userInfo.value?.point || 0) // 필요시
  const userId = computed(() => userInfo.value?.userId || null)

  const getIsLoggedIn = computed(() => !!authToken.value)

  function setAuthToken(token) {
    authToken.value = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  function clearUserData() {
    userInfo.value = null
    setAuthToken(null)
  }

  // 🔥 마이페이지용: 전체 사용자 정보 로딩
  async function loadUserInfo() {
    const res = await fetchUserInfo()
    userInfo.value = res.data
  }

  return {
    authToken,
    userInfo,
    userName,
    userPoints,
    userId,
    getIsLoggedIn,
    setAuthToken,
    clearUserData,
    loadUserInfo,
  }
})
