import PropertyReviewPage from '@/pages/admin/AdminPage.vue'

export default [
  {
    path: '/admin/property-review',
    name: 'property-review',
    component: PropertyReviewPage,
  },
  {
    path: '/admin/property-review/:id',
    name: 'admin-property-detail',
    component: () => import('@/pages/admin/AdminDetailPage.vue'),
  },
]
