<template>
  <div class="p-4 space-y-6">
    <!-- 연도별 그룹 -->
    <div v-for="(group, year) in groupedOrders" :key="year">
      <h3 class="text-sm font-bold text-gray-500 mb-2">{{ year }}년</h3>

      <div
        v-for="(order, index) in group"
        :key="index"
        class="flex justify-between items-center border-b pb-3 mb-3"
      >
        <!-- 날짜 및 시간 -->
        <div class="text-xs text-gray-400 w-14">
          <div>{{ formatDate(order.createdAt, 'MM.DD') }}</div>
          <div>{{ formatDate(order.createdAt, 'HH:mm') }}</div>
        </div>

        <!-- 매물 정보 -->
        <div class="flex-1 ml-3">
          <div class="text-sm font-semibold text-black">
            {{ order.itemName }}
          </div>
          <div class="text-xs mt-1 text-gray-500 flex items-center gap-1">
            <!-- 상태 뱃지 -->
            <span
              class="px-2 py-0.5 rounded-full text-white text-[11px]"
              :class="statusColor(order.status)"
            >
              {{ order.status }}
            </span>
          </div>
        </div>

        <!-- 가격 및 주수 -->
        <div class="text-right text-sm font-semibold text-black">
          <div>{{ order.totalPrice.toLocaleString() }}원</div>
          <div class="text-xs text-red-500 mt-1">구매 {{ order.shares }}주</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const orders = [
  {
    itemName: '대전 한화 스타트업 파크',
    shares: 2,
    totalPrice: 11250,
    status: '입고',
    createdAt: '2025-07-14T11:11:00',
  },
  {
    itemName: '대전 한화 스타트업 파크',
    shares: 2,
    totalPrice: 11250,
    status: '체결',
    createdAt: '2025-07-14T11:11:00',
  },
  {
    itemName: '대전 한화 스타트업 파크',
    shares: 2,
    totalPrice: 11250,
    status: '취소',
    createdAt: '2024-07-14T11:11:00',
  },
]

const formatDate = (dateStr, type) => {
  const date = new Date(dateStr)
  if (type === 'MM.DD')
    return date
      .toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
      .replace(/\./g, '.')
  if (type === 'HH:mm') return date.toTimeString().slice(0, 5)
  return date.toLocaleDateString()
}

const statusColor = (status) => {
  switch (status) {
    case '입고':
      return 'bg-orange-400'
    case '체결':
      return 'bg-blue-500'
    case '취소':
      return 'bg-red-500'
    case '판매 완료':
      return 'bg-purple-600'
    default:
      return 'bg-gray-400'
  }
}

const groupedOrders = computed(() => {
  return orders.reduce((acc, order) => {
    const year = new Date(order.createdAt).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(order)
    return acc
  }, {})
})
</script>
