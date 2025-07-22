<template>
  <div
    class="flex justify-between p-4 border rounded-xl shadow-sm bg-white w-full transition"
    :class="{
      'border-blue-500': status === '승인됨',
      'border-red-500': status === '거절됨',
      'border-gray-300': status === '만료됨',
    }"
  >
    <!-- 왼쪽 텍스트 -->
    <div class="flex flex-col justify-between flex-1 mr-4">
      <div>
        <!-- 제목 -->
        <BaseTypography weight="semibold" color="black">
          {{ title }}
        </BaseTypography>

        <!-- 주소 -->
        <BaseTypography size="xs" weight="regular" color="gray-2" class="mt-0.5">
          {{ address }}
        </BaseTypography>

        <!-- 희망 매각가 -->
        <div class="flex items-center gap-2 mt-2">
          <BaseTypography size="xs" weight="regular" color="gray-2" class="min-w-[90px]">
            희망 매각가
          </BaseTypography>
          <BaseTypography weight="bold" color="black">
            {{ formattedPrice }}
          </BaseTypography>
        </div>

        <!-- 희망 공모 기간 -->
        <div class="flex items-center gap-2 mt-1">
          <BaseTypography size="xs" weight="regular" color="gray-2" class="min-w-[90px]">
            희망 공모 기간
          </BaseTypography>
          <BaseTypography weight="bold" color="black">
            {{ period }}
          </BaseTypography>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="flex w-full gap-2 mt-4">
        <template v-if="status === '대기'">
          <BaseButton variant="outline" class="w-1/2" @click="$emit('approve')">
            <BaseTypography size="xs" weight="semibold" color="blue"> 매물 승인 </BaseTypography>
          </BaseButton>
          <BaseButton class="w-1/2 bg-red-50 text-red-500 border-red-500" @click="$emit('reject')">
            <BaseTypography size="xs" weight="semibold" color="red"> 매물 거절 </BaseTypography>
          </BaseButton>
        </template>

        <template v-else-if="status === '승인됨'">
          <BaseButton variant="primary" class="w-full" disabled>
            <BaseTypography size="xs" weight="semibold" color="white"> 매물 승인됨 </BaseTypography>
          </BaseButton>
        </template>

        <template v-else-if="status === '거절됨'">
          <BaseButton variant="pill" class="w-full" disabled>
            <BaseTypography size="xs" weight="semibold" color="white"> 매물 거절됨 </BaseTypography>
          </BaseButton>
        </template>

        <template v-else-if="status === '만료됨'">
          <BaseButton variant="outline" class="w-full" disabled>
            <BaseTypography size="xs" weight="semibold" color="gray"> 매물 만료됨 </BaseTypography>
          </BaseButton>
        </template>
      </div>
    </div>

    <!-- 오른쪽 이미지 -->
    <img
      :src="image || fallbackImage"
      alt="매물 이미지"
      class="w-28 h-24 object-cover rounded-md"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import fallbackImage from '@/assets/images/cardtestimage.png'

const props = defineProps({
  id: Number,
  title: String,
  address: String,
  price: Number,
  period: String,
  image: String,
  status: String, // "대기", "승인됨", "거절됨", "만료됨"
})

const formattedPrice = computed(() => {
  return props.price ? `${(props.price / 100000000).toFixed(0)}억` : '-'
})
</script>
