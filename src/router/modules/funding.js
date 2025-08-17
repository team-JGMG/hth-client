import FundingDetailPage from '@/pages/funding/FundingDetailPage.vue'
import FundingListPage from '@/pages/funding/FundingListPage.vue'
import FundingTradePage from '@/pages/funding/FundingTradePage.vue'

export default [
  {
    path: '/funding/list',
    name: 'funding-list',
    component: FundingListPage,
    redirect: '/funding/list/in-progress',
    children: [
      {
        path: 'in-progress',
        name: 'funding-in-progress',
        component: FundingListPage,
      },
      {
        path: 'completed-funding',
        name: 'funding-completed-funding',
        component: FundingListPage,
      },
      {
        path: 'completed-sale',
        name: 'funding-completed-sale',
        component: FundingListPage,
      },
    ],
  },

  {
    path: '/funding/detail/:id?',
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
