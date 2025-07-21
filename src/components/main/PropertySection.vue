<template>
  <BaseCard class="h-auto pb-6 mb-6">
    <div class="flex justify-between items-center px-6 mb-6">
      <BaseTypography class="text-left leading-tight">
        보유 매물을 등록하고 <br />
        새로운 가치를 만들어 보세요!
      </BaseTypography>
      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        @click="goToPropertyRegistration"
        aria-label="보유 매물 등록하기"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </div>

    <div class="flex space-x-3 px-6">
      <div class="flex-1 bg-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
        <div class="flex flex-col items-start mb-4">
          <BaseTypography class="text-sm font-regular text-gray-700">
            건물주가 되어 받는
          </BaseTypography>
          <BaseTypography class="text-lg font-bold text-gray-900 leading-tight">
            임대 수익
          </BaseTypography>
        </div>
        <span class="material-symbols-outlined text-4xl text-yellow-500">home_work</span>
      </div>

      <div class="flex-1 bg-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
        <div class="flex flex-col items-start mb-4">
          <BaseTypography class="text-sm font-regular text-gray-700">
            건물 가격 상승하면 얻는
          </BaseTypography>
          <BaseTypography class="text-lg font-bold text-gray-900 leading-tight">
            시세 차익
          </BaseTypography>
        </div>
        <span class="material-symbols-outlined text-4xl text-blue-500">show_chart</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const emit = defineEmits(['register-property'])

const goToPropertyRegistration = () => {
  emit('register-property')
}
</script>
