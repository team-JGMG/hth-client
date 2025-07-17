import { createRouter, createWebHistory } from 'vue-router'

// funding 폴더
import FundingDetailPage from '@/pages/funding/FundingDetailPage.vue'
import FundingListPage from '@/pages/funding/FundingListPage.vue'
import FundingTradePage from '@/pages/funding/FundingTradePage.vue'
import HomePage from '@/pages/HomePage.vue'
// auth 폴더
import LoginPage from '@/pages/auth/LoginPage.vue'
// account 폴더
import MyPage from '@/pages/account/MyPage.vue'
// property/register 폴더 (중첩된 폴더 구조)
import PropertyRegisterPage from '@/pages/property/register/PropertyRegisterPage.vue'
// admin 폴더
import PropertyReviewPage from '@/pages/admin/PropertyReviewPage.vue'
import SignUpPage from '@/pages/auth/SignUpPage.vue'
// trade 폴더
import TradeListPage from '@/pages/trade/TradeListPage.vue'
import TradeOrderPage from '@/pages/trade/TradeOrderPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/account/my-page',
      name: 'my-page',
      component: MyPage,
    },
    {
      path: '/admin/property-review',
      name: 'property-review',
      component: PropertyReviewPage,
    },
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
      path: '/funding/list',
      name: 'funding-list',
      component: FundingListPage,
    },
    {
      path: '/funding/detail', // ':id?'는 ID가 선택적임을 의미
      name: 'funding-detail',
      component: FundingDetailPage,
    },
    {
      path: '/funding/trade',
      name: 'funding-trade',
      component: FundingTradePage,
    },
    {
      path: '/property/register',
      name: 'property-register',
      component: PropertyRegisterPage,
    },
    {
      path: '/trade/list',
      name: 'trade-list',
      component: TradeListPage,
    },
    {
      path: '/trade/order',
      name: 'trade-order',
      component: TradeOrderPage,
    },
    // 404 Not Found 페이지
  ],
})

export default router
