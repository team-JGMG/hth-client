<template>
  <BaseCard v-for="item in tradeItems" :key="item.id" class="h-auto py-5 mb-2 flex flex-col gap-4">
    <button
      @click="tradeOrderPage(item.id)"
      :aria-label="item.name + ' 매물 보기'"
      class="w-full text-left"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center justify-start">
          <img
            :src="item.image"
            :alt="item.name + ' 건물 이미지'"
            class="w-14 h-auto mr-2 rounded-md"
          />
          <BaseTypography class="text-lg text-left leading-tight" weight="bold">
            {{ item.name }}
          </BaseTypography>
        </div>
        <div
          class="w-8 h-8 flex justify-end items-center text-black rounded-full transition-colors"
          aria-hidden="true"
        >
          <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </div>
      </div>
    </button>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { fetchOrderBookByFundingId } from '@/api/orderbook'

const router = useRouter()

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const tradeItems = computed(() => {
  console.log('💡 props.items:', props.items)

  const imagePaths = [
    new URL('../../assets/images/randombuilding/building1.png', import.meta.url).href,
    new URL('../../assets/images/randombuilding/building2.png', import.meta.url).href,
    new URL('../../assets/images/randombuilding/building3.png', import.meta.url).href,
    new URL('../../assets/images/randombuilding/building4.png', import.meta.url).href,
  ]

  const oldAssignments = JSON.parse(localStorage.getItem('tradeItemImages')) || {}
  const newAssignments = { ...oldAssignments }
  let needsUpdate = false

  props.items.forEach((item) => {
    if (!newAssignments[item.fundingId]) {
      const randomIndex = Math.floor(Math.random() * imagePaths.length)
      newAssignments[item.fundingId] = imagePaths[randomIndex]
      needsUpdate = true
    }
  })

  if (needsUpdate) {
    localStorage.setItem('tradeItemImages', JSON.stringify(newAssignments))
  }

  return props.items.map((item) => ({
    id: item.fundingId,
    name: item.title,
    image: newAssignments[item.fundingId],
  }))
})

const tradeOrderPage = async (id) => {
  try {
    await fetchOrderBookByFundingId(id)
    router.push(`/trade/order/${id}`)
  } catch (e) {
    console.error('페이지 이동 실패:', e)
  }
}
</script>
