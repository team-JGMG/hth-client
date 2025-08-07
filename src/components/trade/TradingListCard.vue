<template>
  <BaseCard
    v-for="item in tradeItems"
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const tradeItems = ref([])
const router = useRouter()

watch(
  () => props.items,
  (newItems) => {
    if (!newItems.length) return

    const imagePaths = [
      new URL('../../assets/images/randombuilding/building1.png', import.meta.url).href,
      new URL('../../assets/images/randombuilding/building2.png', import.meta.url).href,
      new URL('../../assets/images/randombuilding/building3.png', import.meta.url).href,
      new URL('../../assets/images/randombuilding/building4.png', import.meta.url).href,
    ]

    const oldAssignments = JSON.parse(localStorage.getItem('tradeItemImages')) || {}
    const newAssignments = { ...oldAssignments }
    let needsUpdate = false

    newItems.forEach((item) => {
      const key = `funding_${item.fundingId}`
      if (!newAssignments[key]) {
        const randomIndex = Math.floor(Math.random() * imagePaths.length)
        newAssignments[key] = imagePaths[randomIndex]
        needsUpdate = true
      }
    })

    if (needsUpdate) {
      localStorage.setItem('tradeItemImages', JSON.stringify(newAssignments))
    }

    tradeItems.value = newItems.map((item) => {
      const key = `funding_${item.fundingId}`
      return {
        ...item,
        image: newAssignments[key],
      }
    })
  },
  { immediate: true },
)

const tradeOrderPage = (id) => {
  router.push(`/trade/order/${id}`)
}
</script>
