import PropertyReviewPage from '@/pages/admin/AdminPage.vue'
import AdminDetailPage from '@/pages/admin/AdminDetailPage.vue'

export default [
  {
    path: '/admin/property-review',
    name: 'property-review',
    component: PropertyReviewPage,
  },
  {
    path: '/admin/property-review/:id',
    name: 'AdminPropertyDetail',
    component: AdminDetailPage,
  },
]
