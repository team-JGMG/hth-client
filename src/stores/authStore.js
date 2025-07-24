import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
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
