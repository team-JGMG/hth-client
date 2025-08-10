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
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <img
            :src="item.image"
            :alt="item.title + ' 건물 이미지'"
            class="w-14 h-14 object-cover rounded-md flex-shrink-0"
          />

          <div class="flex flex-col flex-1 min-w-0">
            <BaseTypography class="text-lg leading-tight truncate" weight="bold">
              {{ item.title }}
            </BaseTypography>

            <!-- 태그 -->
            <div v-if="getTagsPreview(item.tags).length" class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="(tag, i) in getTagsPreview(item.tags)"
                :key="tag + '-' + i"
                class="bg-gray-100 text-[8px] text-gray-600 px-2 py-0.5 rounded-full"
                :title="tag"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- RIGHT: 화살표 -->
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

// 태그 추가
function getTagsPreview(tags) {
  const arr = Array.isArray(tags) ? tags : []
  return arr.map((t) => (typeof t === 'string' ? t.trim() : '')).filter(Boolean)
}

const router = useRouter()
const tradeOrderPage = (id) => {
  router.push(`/trade/order/${id}`)
}
</script>
