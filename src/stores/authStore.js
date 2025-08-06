// stores/authStore.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { fetchUserInfo } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // 🔐 토큰 관련
  const authToken = ref(localStorage.getItem('authToken') || '')
  const accessToken = ref(localStorage.getItem('accessToken') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')

  // 👤 유저 정보
  const userInfo = ref(null)
  const userName = computed(() => userInfo.value?.name || '')
  const userPoints = computed(() => userInfo.value?.point || 0)
  const userId = computed(() => userInfo.value?.userId || null)

  // ✅ 로그인 여부
  const getIsLoggedIn = computed(() => !!authToken.value || !!accessToken.value)

  // ✅ 유저 정보 불러오기
  async function loadUserInfo() {
    const res = await fetchUserInfo()
    userInfo.value = res.data
  }

  // 🔧 토큰 설정
  function setAuthToken(token) {
    authToken.value = token
    if (token) {
      localStorage.setItem('authToken', token)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  function setTokens(access, refresh) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  // 🔒 로그아웃
  function logout() {
    authToken.value = ''
    accessToken.value = ''
    refreshToken.value = ''
    userInfo.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  function clearUserData() {
    userInfo.value = null
    setAuthToken(null)
  }

  return {
    // state
    authToken,
    accessToken,
    refreshToken,
    userInfo,

    // computed
    getIsLoggedIn,
    userName,
    userPoints,
    userId,

    // actions
    setAuthToken,
    setTokens,
    logout,
    clearUserData,
    loadUserInfo,
  }
})

// ✨ 이전 useUserStore를 쓰던 컴포넌트들을 위해 별칭 export 제공
export const useUserStore = useAuthStore
