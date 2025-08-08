import { computed, ref } from 'vue'

import { defineStore } from 'pinia'
import { fetchUserInfo } from '@/api/auth'

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
      logout,
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
