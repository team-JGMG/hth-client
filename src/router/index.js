import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '@/pages/NotFound.vue'
import NotificationPage from '@/pages/notification/NotificationPage.vue'
import accountRoutes from './modules/account'
import adminRoutes from './modules/admin'
import authRoutes from './modules/auth'
import fundingRoutes from './modules/funding'
import propertyRoutes from './modules/property'
import publicRoutes from './modules/public'
import tradeRoutes from './modules/trade'

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
      path: '/payment-complete',
      name: 'PaymentCompleteBridge',
      meta: { public: true },
      beforeEnter: async (to, _from, next) => {
        const { useToastStore } = await import('@/stores/toast')
        const { useAuthStore } = await import('@/stores/authStore')
        const { verifyPayment, getPointBalance } = await import('@/api/point')

        const toast = useToastStore()
        const auth = useAuthStore()

        const impUid = String(to.query.imp_uid || '')
        const merchantUid = String(to.query.merchant_uid || '')

        if (!impUid || !merchantUid) {
          toast.error({ title: '오류', body: '결제 식별자(imp_uid/merchant_uid)가 없습니다.' })
          return next({ name: 'NotFound' })
        }

        try {
          await verifyPayment({ impUid, merchantUid })

          try {
            const point = await getPointBalance()
            auth.setUserPoint(point)
          } catch {
            //
          }

          toast.success({ title: '충전 완료', body: '포인트 충전이 완료되었습니다.' })
          return next({ path: '/' })
        } catch (e) {
          const msg = e?.response?.data?.message || e?.message || '결제 검증에 실패했습니다.'
          toast.error({ title: '검증 실패', body: msg })
          return next({ path: '/' })
        }
      },
    },

    { path: '/fcm-test', name: 'fcm-test', component: NotificationPage },

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

export default router
