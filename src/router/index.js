// src/router/index.js
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

    // ✅ 성공 페이지 없이 처리: 가드에서 검증 수행
    {
      path: '/payment-complete',
      name: 'PaymentCompleteBridge',
      meta: { public: true }, // 전역 가드 우회
      beforeEnter: async (to, _from, next) => {
        // 동적 import (순환참조 방지 & 초기 번들 최소화)
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
          // 서버가 금액/상태를 교차검증하므로 amount는 생략 가능
          await verifyPayment({ impUid, merchantUid })

          // 포인트 잔액 갱신 (실패해도 흐름 계속)
          try {
            const point = await getPointBalance()
            auth.setUserPoint(point)
          } catch {
            //
          }

          toast.success({ title: '충전 완료', body: '포인트 충전이 완료되었습니다.' })
          return next({ path: '/point' }) // 완료 후 이동 경로 (원하면 변경)
        } catch (e) {
          const msg = e?.response?.data?.message || e?.message || '결제 검증에 실패했습니다.'
          toast.error({ title: '검증 실패', body: msg })
          return next({ path: '/point' }) // 실패 시 이동 경로
        }
      },
    },

    { path: '/fcm-test', name: 'fcm-test', component: NotificationPage },

    // 항상 마지막: catch-all
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
})

export default router
