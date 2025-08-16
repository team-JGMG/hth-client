<template>
  <section v-if="seller" class="mt-1 px-2 bg-white">
    <BaseTypography class="mb-2" weight="semibold" size="lg">매도자 정보</BaseTypography>
    <div class="px-1 pb-2">
      <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">이름</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ seller.name || '-' }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">전화번호</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ formatPhoneNumber(seller.phone || '-') }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1">이메일</BaseTypography>
        <BaseTypography weight="regular" class="px-3 py-2">{{ seller.email || '-' }}</BaseTypography>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { formatPhoneNumber } from '@/utils/format'

defineProps({
  seller: Object,
})
</script>
