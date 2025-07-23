<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'select'])

const selectedBank = ref(null)

const banks = [
  {
    code: 'KB',
    label: '국민은행',
    img: new URL('@/assets/images/KbIcon.png', import.meta.url).href,
  },
  {
    code: 'SHINHAN',
    label: '신한은행',
    img: new URL('@/assets/images/ShinhanIcon.png', import.meta.url).href,
  },
  {
    code: 'NH',
    label: '농협',
    img: new URL('@/assets/images/NonghyupIcon.png', import.meta.url).href,
  },
  {
    code: 'KAKAOBANK',
    label: '카카오뱅크',
    img: new URL('@/assets/images/KakaoIcon.png', import.meta.url).href,
  },
  {
    code: 'IBK',
    label: '기업은행',
    img: new URL('@/assets/images/IbkIcon.png', import.meta.url).href,
  },
  {
    code: 'TOSS',
    label: '토스뱅크',
    img: new URL('@/assets/images/TossIcon.png', import.meta.url).href,
  },
  {
    code: 'WOORI',
    label: '우리은행',
    img: new URL('@/assets/images/WooriIcon.png', import.meta.url).href,
  },
  {
    code: 'HANA',
    label: '하나은행',
    img: new URL('@/assets/images/HanaIcon.png', import.meta.url).href,
  },
  {
    code: 'K',
    label: '케이뱅크',
    img: new URL('@/assets/images/KBankIcon.png', import.meta.url).href,
  },
]

function selectBank(bank) {
  selectedBank.value = bank.code
  emit('select', bank)
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl px-6 py-8 w-[360px] relative shadow-lg">
      <!-- 닫기 버튼 -->
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        @click="emit('close')"
      >
        ×
      </button>

      <!-- 상단 여백 (제목 없음) -->
      <div class="h-6 mb-6"></div>

      <!-- 은행 목록 -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div
          v-for="bank in banks"
          :key="bank.code"
          @click="selectBank(bank)"
          :class="[
            'flex flex-col items-center justify-center border rounded-xl p-3 cursor-pointer transition',
            selectedBank === bank.code ? 'border-black' : 'border-gray-200 hover:border-gray-400',
          ]"
        >
          <img :src="bank.img" alt="은행 로고" class="w-10 h-10 mb-1 object-contain" />
          <span class="text-xs text-center whitespace-nowrap">{{ bank.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
