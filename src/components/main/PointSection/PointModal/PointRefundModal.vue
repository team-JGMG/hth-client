<template>
  <div>
    <div class="flex items-center mb-2">
      <span class="material-symbols-outlined mb-2 mr-2"> remove </span>
      <BaseTypography size="xl" weight="bold" class="mb-2">포인트 환급하기</BaseTypography>
    </div>
    <BaseTypography size="base" class="mb-2">환급하실 포인트를 입력해주세요.</BaseTypography>
    <div class="flex justify-end items-end w-full mb-4">
      <div class="flex items-end border-b border-gray-300">
        <input
          type="number"
          placeholder="금액을 입력해주세요."
          class="w-60 p-2 focus:outline-none placeholder:text-gray-400"
        />
      </div>
      <BaseTypography size="base" class="ml-2 mb-2">원</BaseTypography>
    </div>

    <div class="mt-2">
      <BaseTypography size="base" class="mb-2">환급 계좌 정보</BaseTypography>
      <div class="w-full p-4 bg-gray-100 rounded">
        <!-- 추후 계좌 데이터 가져오기 -->
        <BaseTypography size="base" color="gray-1"
          >국민은행 000000-00-000000 (이채빵)</BaseTypography
        >
      </div>
    </div>

    <BaseTypography size="xs" color="red" class="text-center mt-6">
      환급 신청은 영업일 기준 1~2일 이내에 처리됩니다.<br />
      환급 시 소정의 수수료가 부과될 수 있습니다.
    </BaseTypography>
  </div>
</template>

<script setup>
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
</script>
