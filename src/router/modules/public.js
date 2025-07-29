import HomePage from '@/pages/HomePage.vue'
import OnboardingPage from '@/pages/onboarding/OnboardingPage.vue'

export default [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  { path: '/onboarding', name: 'OnboardingPage', component: OnboardingPage },
]
