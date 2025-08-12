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

    // ✅ 로그인 여부 (userInfo 값 존재 여부로 판단)
    const getIsLoggedIn = computed(() => !!userInfo.value)

    // 로그인 성공 직후 FCM 초기화
    async function initFcmIfLoggedIn() {
      if (!userInfo.value?.userId) return
      try {
        const { useFcmStore } = await import('@/stores/fcm')
        const fcm = useFcmStore()
        await fcm.init() // 권한/서비스워커/토큰 확보
        if (!fcm.token) return

        // 마지막 등록 정보 확인
        const last = JSON.parse(localStorage.getItem(LAST_REG_KEY) || 'null')

        // uid 또는 token이 달라지면 서버에 업서트
        if (!last || last.uid !== uid || last.token !== fcm.token) {
          await registerDeviceToken(fcm.token) // POST /api/auth/device-tokens
          localStorage.setItem(LAST_REG_KEY, JSON.stringify({ uid, token: fcm.token }))
        }
      } catch (e) {
        console.warn('[FCM] 초기화 실패:', e)
      }
    }

    // ✅ 유저 정보 불러오기 (API 요청)
    async function loadUserInfo() {
      try {
        console.log('🌐 fetchUserInfo API 호출')
        const res = await fetchUserInfo()
        // 필요 시 res.data.data로 변경
        userInfo.value = res.data
        await initFcmIfLoggedIn() // ← 여기서 바로 FCM 초기화
      } catch (error) {
        console.error('[유저 정보 로딩 실패]', error)
        userInfo.value = null
      }
    }

    // ✅ 유저 정보 수동 설정 (로그인 콜백 등)
    async function setUserInfo(user) {
      console.log('📝 setUserInfo 호출:', user)

      userInfo.value = user
      await initFcmIfLoggedIn()
    }

    // ✅ 포인트만 업데이트
    function setUserPoint(point) {
      if (userInfo.value) userInfo.value.point = point
    }

    // 🔒 로그아웃
    async function logout() {
      console.log('🚪 로그아웃 처리')
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
export * from './authStore'
