<template>
  <BaseCard
    v-for="item in itemsWithImages"
    :key="item.fundingId"
    class="h-auto py-5 mb-2 flex flex-col gap-4"
  >
    <button
      @click="tradeOrderPage(item.fundingId)"
      :aria-label="item.title + ' 매물 보기'"
      class="w-full text-left"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center justify-start">
          <img
            :src="item.image"
            :alt="item.title + ' 건물 이미지'"
            class="w-14 h-auto mr-2 rounded-md"
          />
          <BaseTypography class="text-lg text-left leading-tight" weight="bold">
            {{ item.title }}
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

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const imagePaths = [
  new URL('@/assets/images/randombuilding/building1.png', import.meta.url).href,
  new URL('@/assets/images/randombuilding/building2.png', import.meta.url).href,
  new URL('@/assets/images/randombuilding/building3.png', import.meta.url).href,
  new URL('@/assets/images/randombuilding/building4.png', import.meta.url).href,
]

const getRandomImageMap = (items) => {
  const oldAssignments = JSON.parse(localStorage.getItem('tradeItemImages')) || {}
  const newAssignments = { ...oldAssignments }
  let updated = false

  items.forEach((item) => {
    const key = `funding_${item.fundingId}`
    if (!newAssignments[key]) {
      const randomIndex = Math.floor(Math.random() * imagePaths.length)
      newAssignments[key] = imagePaths[randomIndex]
      updated = true
    }
  })

  if (updated) {
    localStorage.setItem('tradeItemImages', JSON.stringify(newAssignments))
  }

  return newAssignments
}

const itemsWithImages = computed(() => {
  if (!props.items?.length) return []
  const imageMap = getRandomImageMap(props.items)

  return props.items.map((item) => ({
    ...item,
    image: imageMap[`funding_${item.fundingId}`],
  }))
})

const router = useRouter()
const tradeOrderPage = (id) => {
  router.push(`/trade/order/${id}`)
}
</script>
