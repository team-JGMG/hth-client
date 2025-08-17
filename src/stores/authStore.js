import { computed, ref } from 'vue'
import { fetchUserInfo, logout as logoutRequest } from '@/api/auth'

import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const userInfo = ref(null)

    const userName = computed(() => userInfo.value?.name || '')
    const userPoints = computed(() => userInfo.value?.point ?? null)
    const userId = computed(() => userInfo.value?.userId ?? null)

    const getIsLoggedIn = computed(() => !!userInfo.value)

    async function initFcmIfLoggedIn() {
      if (!userInfo.value?.userId) return
      try {
        const { useFcmStore } = await import('@/stores/fcm')
        const fcm = useFcmStore()
        await fcm.init()
      } catch {
        //
      }
    }

    async function loadUserInfo() {
      try {
        const res = await fetchUserInfo()
        userInfo.value = res.data
        await initFcmIfLoggedIn()
      } catch {
        userInfo.value = null
      }
    }

    async function setUserInfo(user) {
      userInfo.value = user
      await initFcmIfLoggedIn()
    }

    function setUserPoint(point) {
      if (userInfo.value) userInfo.value.point = point
    }

    async function logout() {
      try {
        const { useFcmStore } = await import('@/stores/fcm')
        const fcm = useFcmStore()

        await fcm.init()
        const deviceToken = fcm.token || null

        await logoutRequest(deviceToken)

        fcm.reset()
      } catch {
        //
      } finally {
        userInfo.value = null
        localStorage.removeItem('refreshToken')
      }
    }

    return {
      userInfo,
      getIsLoggedIn,
      userName,
      userPoints,
      userId,
      loadUserInfo,
      setUserInfo,
      setUserPoint,
      logout,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['userInfo.userId', 'userInfo.name'],
    },
  },
)

export const useUserStore = useAuthStore
