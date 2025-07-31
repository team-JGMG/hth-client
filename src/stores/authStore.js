import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userInfo: null,
  }),
  actions: {
    login() {
      this.isLoggedIn = true
    },
    logout() {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      this.isLoggedIn = false
      this.userInfo = null
    },
    setTokens(accessToken, refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      this.isLoggedIn = true
    },
    setLoggedIn(status) {
      this.isLoggedIn = status
    },
    setUserInfo(user) {
      this.userInfo = user
    },
  },
  getters: {
    getIsLoggedIn: (state) => state.isLoggedIn,
    getUserInfo: (state) => state.userInfo,
  },
})
