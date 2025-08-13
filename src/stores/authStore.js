import { computed, ref } from 'vue'

import { defineStore } from 'pinia'
import { fetchUserInfo } from '@/api/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    // 👤 유저 정보
    const userInfo = ref(null)

    const userName = computed(() => userInfo.value?.name || '')
    const userPoints = computed(() => userInfo.value?.point ?? null)
    const userId = computed(() => userInfo.value?.userId ?? null)

    // ✅ 로그인 여부
    const getIsLoggedIn = computed(() => !!userInfo.value)

    // 로그인 성공 직후 FCM 초기화 → fcm 스토어에 위임
    async function initFcmIfLoggedIn() {
      if (!userInfo.value?.userId) return
      try {
        const { useFcmStore } = await import('@/stores/fcm')
        const fcm = useFcmStore()
        await fcm.init()
      } catch (e) {
        console.warn('[FCM] 초기화 실패:', e)
      }
    }

    // ✅ 유저 정보 불러오기
    async function loadUserInfo() {
      try {
        const res = await fetchUserInfo()
        // 필요 시 res.data.data
        userInfo.value = res.data
        await initFcmIfLoggedIn()
      } catch (error) {
        console.error('[유저 정보 로딩 실패]', error)
        userInfo.value = null
      }
    }

    // ✅ 유저 정보 수동 설정 (로그인 콜백 등)
    async function setUserInfo(user) {
      userInfo.value = user
      await initFcmIfLoggedIn()
    }

    // ✅ 포인트만 업데이트
    function setUserPoint(point) {
      if (userInfo.value) userInfo.value.point = point
    }

    // 🔒 로그아웃
    async function logout() {
      userInfo.value = null
      localStorage.removeItem('refreshToken')
      try {
        const { useFcmStore } = await import('@/stores/fcm')
        useFcmStore().reset()
      } catch (e) {
        console.warn('[FCM] 리셋 실패:', e)
      }
    }

    return {
      // state
      userInfo,
      // getters
      getIsLoggedIn,
      userName,
      userPoints,
      userId,
      // actions
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

// 호환용 별칭
export const useUserStore = useAuthStore
// ❌ 순환 재수출 제거 (자기 자신 재수출)
// export * from './authStore'
