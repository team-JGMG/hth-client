import { computed, ref } from 'vue'

import { defineStore } from 'pinia'
import { fetchUserInfo } from '@/api/auth'

const LAST_REG_KEY = 'fcm:lastReg' // { uid, token } 저장

export const useAuthStore = defineStore(
  'auth',
  () => {
    // 👤 유저 정보
    const userInfo = ref(null)

    const userName = computed(() => userInfo.value?.name || '')
    const userPoints = computed(() => userInfo.value?.point || 0)
    const userId = computed(() => userInfo.value?.userId || null)

    // ✅ 로그인 여부 (userInfo 값 존재 여부로 판단)
    const getIsLoggedIn = computed(() => !!userInfo.value)

    // ✅ 로그인 상태에서만 FCM 토큰 등록/갱신
    async function registerFcmTokenIfLoggedIn() {
      try {
        const uid = userInfo.value?.userId
        if (!uid) return

        const [{ useFcmStore }, { registerDeviceToken }] = await Promise.all([
          import('@/stores/fcm'),
          import('@/api/auth'),
        ])

        const fcm = useFcmStore()
        await fcm.init() // 권한/서비스워커/토큰 확보
        if (!fcm.token) return

        // 마지막 등록 정보 확인
        const last = JSON.parse(localStorage.getItem(LAST_REG_KEY) || 'null')

        // uid 또는 token이 달라지면 서버에 업서트
        if (!last || last.uid !== uid || last.token !== fcm.token) {
          await registerDeviceToken(uid, fcm.token) // POST /api/users/{userId}/device-token
          localStorage.setItem(LAST_REG_KEY, JSON.stringify({ uid, token: fcm.token }))
        }
      } catch (e) {
        console.warn('[FCM] 토큰 등록 실패:', e)
      }
    }

    // ✅ 유저 정보 불러오기 (API 요청)
    async function loadUserInfo() {
      try {
        const res = await fetchUserInfo()
        userInfo.value = res.data
      } catch (error) {
        console.error('[유저 정보 로딩 실패]', error)
        userInfo.value = null
        // throw error // ★ 주석 처리: 초기 로딩 실패 시 에러를 던지지 않음
      }
    }

    // ✅ 유저 정보 수동 설정
    function setUserInfo(user) {
      userInfo.value = user
      registerFcmTokenIfLoggedIn()
    }

    // ✅ 포인트 정보만 업데이트
    function setUserPoint(point) {
      if (userInfo.value) {
        userInfo.value.point = point
      }
    }

    // 🔒 로그아웃 처리
    function logout() {
      userInfo.value = null
      localStorage.removeItem('refreshToken') // ← 사용 중이면 유지, 아니라면 삭제 가능
    }

    return {
      // 상태
      userInfo,

      // 계산된 값
      getIsLoggedIn,
      userName,
      userPoints,
      userId,

      // 액션
      loadUserInfo,
      setUserInfo,
      setUserPoint,
      logout,
      registerFcmTokenIfLoggedIn,
    }
  },
  {
    // 페이지 새로고침 시 상태 유지 (pinia-plugin-persistedstate)
    persist: {
      storage: localStorage,
      // paths: ['userInfo'], // `userInfo`만 저장 (선택 사항)
    },
  },
)

// ✨ 기존 useUserStore 사용 코드 호환용 별칭
export const useUserStore = useAuthStore
export * from './authStore'
