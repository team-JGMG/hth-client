<template>
  <div class="py-2"></div>
  <BaseTypography tag="h2" class="text-base !font-bold mb-4 text-left">투자 포인트</BaseTypography>
  <div class="rounded-xl p-4">
    <!-- 제목 -->

    <!-- 포인트 박스 리스트 -->
    <ul class="space-y-3">
      <li
        v-for="(point, idx) in investmentPoints"
        :key="idx"
        class="bg-blue-50 px-4 py-3 rounded-xl text-sm text-gray-800 text-center"
      >
        <div class="font-semibold mb-1">{{ point.title }}</div>
        <div class="text-xs text-gray-600 leading-snug">{{ point.description }}</div>
      </li>
    </ul>
  </div>
  <div class="py-5"></div>
  <div>
    <BaseTypography tag="h2" class="text-lg !font-bold mb-2">위치 정보</BaseTypography>
    <BaseTypography class="text-sm mb-4">{{ item.address }}</BaseTypography>
    <div class="h-60 bg-gray-300 flex items-center justify-center text-gray-500">
      지도 API 여기에 들어갈 예정
    </div>
  </div>
  <div class="py-2"></div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
defineProps({ item: Object })

const investmentPoints = [
  {
    title: '인근 시세 대비 약 17% 낮은 공모가',
    description: `"그린바운더리레빌당"은 주변 시세와 경쟁가보다 저렴해 추후 매각 차익이 기대돼요.`,
  },
  {
    title: '제2의 성수를 꿈꾸는 신촌의 붐',
    description:
      '다양한 창업 센터로 젊은 창업자들이 모여 스타트업의 성지로 변모할 것으로 기대돼요.',
  },
]
</script>
