import LoginPage from '@/pages/auth/LoginPage.vue'
import SignUpPage from '@/pages/auth/SignUpPage.vue'
import LoginCallback from '@/pages/auth/LoginCallback.vue'
export default [
  {
    path: '/auth/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignUpPage,
  },
  {
    path: '/auth/callback',
    name: 'LoginCallback',
    component: LoginCallback,
  },
]
