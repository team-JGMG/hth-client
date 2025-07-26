import { createRouter, createWebHistory } from 'vue-router'

import accountRoutes from './modules/account'
import adminRoutes from './modules/admin'
import authRoutes from './modules/auth'
import fundingRoutes from './modules/funding'
import propertyRoutes from './modules/property'
import publicRoutes from './modules/public'
import tradeRoutes from './modules/trade'
import NotFound from '@/pages/NotFound.vue'

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
      component: NotFound,
    },
  ],
})

export default router
