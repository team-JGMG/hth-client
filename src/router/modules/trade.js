import TradeListPage from '@/pages/trade/TradeListPage.vue'
import TradeOrderPage from '@/pages/trade/TradeOrderPage.vue'

export default [
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
]
