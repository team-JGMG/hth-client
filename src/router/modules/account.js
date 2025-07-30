import MyPage from '@/pages/account/MyPage.vue'

export default [
  {
    path: '/account/my-page',
    name: 'my-page',
    component: MyPage,
    redirect: '/account/my-page/points',
    children: [
      {
        path: 'points',
        name: 'my-page-points',
        component: () => import('@/components/account/PointInfo.vue'),
      },
      {
        path: 'listings',
        name: 'my-page-listings',
        component: () => import('@/components/account/MyListings.vue'),
      },
      {
        path: 'investments',
        name: 'my-page-investments',
        component: () => import('@/components/account/MyInvestments.vue'),
      },
      {
        path: 'orderLists',
        name: 'my-page-rderLists',
        component: () => import('@/components/account/OrderLists.vue'),
      },
    ],
  },
]
