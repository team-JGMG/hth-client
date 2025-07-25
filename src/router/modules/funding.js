import FundingDetailPage from '@/pages/funding/FundingDetailPage.vue'
import FundingListPage from '@/pages/funding/FundingListPage.vue'
import FundingTradePage from '@/pages/funding/FundingTradePage.vue'

export default [
  {
    path: '/funding/list',
    name: 'funding-list',
    component: FundingListPage,
  },
  {
    path: '/funding/detail/:id?', // ? : optional ID
    name: 'funding-detail',
    component: FundingDetailPage,
  },
  {
    path: '/funding/trade/:id?',
    name: 'funding-trade',
    component: FundingTradePage,
  },
  { path: '/kk', name: 'kakao-map', component: FundingDetailPage },
]
