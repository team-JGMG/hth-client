import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 임시로 true로 설정함, 추후 로직 구현 시 false 변경 필요
    isLoggedIn: true,
  }),
  actions: {
    login() {
      this.isLoggedIn = true
    },
    logout() {
      this.isLoggedIn = false
      // 실제 로그아웃 로직
    },
    // 로그인 상태를 설정하는 액션 (선택 사항)
    setLoggedIn(status) {
      this.isLoggedIn = status
    },
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
  },
})
