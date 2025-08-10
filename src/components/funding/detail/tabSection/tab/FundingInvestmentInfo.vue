<template>
  <BaseTypography size="base" weight="bold" class="mb-3">투자 포인트</BaseTypography>
  <div class="rounded-xl">
    <!-- 포인트 박스 리스트 -->
    <div
      v-for="tag in item.tags"
      :key="tag.id"
      class="bg-blue-50 px-4 py-3 rounded-xl text-center mb-4"
    >
      <BaseTypography size="sm" weight="bold" class="mb-1">
        {{ tag.description.split('\n')[0] }}
      </BaseTypography>
      <BaseTypography
        v-if="tag.description.includes('\n')"
        size="xs"
        color="gray-1"
        class="break-keep"
      >
        {{ tag.description.split('\n').slice(1).join('\n') }}
      </BaseTypography>
    </div>
  </div>
  <div>
    <BaseTypography size="base" weight="bold" class="mb-3 mt-4">주변 살펴보기</BaseTypography>
    <KakaoMap />
  </div>
  <div class="py-2"></div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import KakaoMap from '../Kakaomap/KakaoMap.vue'
defineProps({ item: Object })
</script>
