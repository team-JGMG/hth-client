import { createRouter, createWebHistory } from 'vue-router'

import accountRoutes from './modules/account'
import adminRoutes from './modules/admin'
import authRoutes from './modules/auth'
import fundingRoutes from './modules/funding'
import propertyRoutes from './modules/property'
import tradeRoutes from './modules/trade'
import publicRoutes from './modules/public'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...publicRoutes,
    ...accountRoutes,
    ...adminRoutes,
    ...authRoutes,
    ...fundingRoutes,
    ...propertyRoutes,
    ...tradeRoutes,

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      // component: () => import('@/pages/NotFoundPage.vue'),
      // 실제 404 페이지 컴포넌트 연결
      redirect: '/',
    },
  ],
})

export default router
