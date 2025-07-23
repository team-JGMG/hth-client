<template>
  <BaseCard v-for="item in tradeItems" :key="item.id" class="h-auto pb-6 mb-2 flex flex-col gap-4">
    <button @click="tradeOrderPage(item.id)" :aria-label="item.name + ' 매물 보기'">
      <div class="flex justify-between items-center">
        <div class="flex items-center justify-start">
          <img :src="item.image" alt="Building" class="w-10 h-10 mr-2 rounded-md" />
          <BaseTypography class="text-lg text-left leading-tight" weight="bold">
            {{ item.name }}
          </BaseTypography>
        </div>
        <button
          class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        >
          <span class="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      </div>
    </button>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const buildingFileNames = ['building1.png', 'building2.png', 'building3.png', 'building4.png']

const tradeItems = ref([])

onMounted(() => {
  const imagePaths = buildingFileNames.map(
    (fileName) => new URL(`../../assets/images/randombuilding/${fileName}`, import.meta.url).href,
  )
  // Simulate API call
  tradeItems.value = [
    { id: 1, name: '대전 하나 스타트업 파크', image: imagePaths[0] },
    { id: 2, name: '신도림 핀포인트타워 1호', image: imagePaths[1] },
    { id: 3, name: '여의도 하이엔드 타워', image: imagePaths[2] },
    { id: 4, name: '강남 파이낸스 센터', image: imagePaths[3] },
  ]
})

const tradeOrderPage = (id) => {
  router.push(`/trade/order/${id}`)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
