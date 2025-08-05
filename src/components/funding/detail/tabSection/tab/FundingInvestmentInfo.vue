<template>
  <BaseTypography size="base" weight="bold" class="mb-3">투자 포인트</BaseTypography>
  <div class="rounded-xl">
    <!-- 포인트 박스 리스트 -->
    <ul class="space-y-2">
      <li
        v-for="(point, idx) in investmentPoints"
        :key="idx"
        class="bg-blue-50 px-4 py-3 rounded-xl text-center"
      >
        <BaseTypography size="sm" weight="bold" class="mb-1">{{ point.title }}</BaseTypography>
        <BaseTypography size="xs" color="gray-1" class="break-keep">{{
          point.description
        }}</BaseTypography>
      </li>
    </ul>
  </div>
  <div>
    <BaseTypography size="base" weight="bold" class="mb-2 mt-4">주변 살펴보기</BaseTypography>
    <div class="flex items-center gap-1 mb-4">
      <span class="material-symbols-rounded text-gray-500" style="font-size: 1rem">
        location_on
      </span>
      <BaseTypography size="xs" color="gray-1">{{ item.address }}</BaseTypography>
    </div>

    <KakaoMap />
  </div>
  <div class="py-2"></div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import KakaoMap from '../Kakaomap/KakaoMap.vue'
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
