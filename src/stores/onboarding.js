import { defineStore } from 'pinia'

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    hasVisited: localStorage.getItem('hasVisited') === 'true',
  }),
  actions: {
    completeOnboarding() {
      this.hasVisited = true
      localStorage.setItem('hasVisited', 'true')
    },
  },
})
