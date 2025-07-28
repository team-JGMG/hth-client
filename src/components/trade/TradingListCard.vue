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
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
})

const router = useRouter()

// 템플릿에서 사용할 이미지 정보가 추가된 아이템 목록
const tradeItems = ref([])

onMounted(() => {
  const imagePaths = [
    new URL('../../assets/images/randombuilding/building1.png', import.meta.url).href,
    new URL('../../assets/images/randombuilding/building2.png', import.meta.url).href,
    new URL('../../assets/images/randombuilding/building3.png', import.meta.url).href,
    new URL('../../assets/images/randombuilding/building4.png', import.meta.url).href,
  ]

  // 로컬 스토리지를 사용하여 이미지 할당을 유지합니다.
  const oldAssignments = JSON.parse(localStorage.getItem('tradeItemImages')) || {}
  const newAssignments = { ...oldAssignments }
  let needsUpdate = false // 로컬 스토리지 업데이트가 필요한지 확인

  props.items.forEach((item) => {
    // 해당 아이템 ID에 할당된 이미지가 없으면 새로 할당합니다.
    if (!newAssignments[item.id]) {
      const randomIndex = Math.floor(Math.random() * imagePaths.length)
      newAssignments[item.id] = imagePaths[randomIndex]
      needsUpdate = true
    }
  })

  // 새로운 할당이 있다면 로컬 스토리지에 저장합니다.
  if (needsUpdate) {
    localStorage.setItem('tradeItemImages', JSON.stringify(newAssignments))
  }

  // props.items에 이미지 경로를 추가하여 tradeItems를 업데이트합니다.
  tradeItems.value = props.items.map((item) => ({
    ...item,
    image: newAssignments[item.id],
  }))
})

const tradeOrderPage = (id) => {
  router.push(`/trade/order/${id}`)
}
</script>
