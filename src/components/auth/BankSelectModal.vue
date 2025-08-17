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
    code: 'SH',
    label: '신한은행',
    img: new URL('@/assets/images/ShinhanIcon.png', import.meta.url).href,
  },
  {
    code: 'NH',
    label: '농협',
    img: new URL('@/assets/images/NonghyupIcon.png', import.meta.url).href,
  },
  {
    code: 'KA',
    label: '카카오뱅크',
    img: new URL('@/assets/images/KakaoIcon.png', import.meta.url).href,
  },
  {
    code: 'IB',
    label: '기업은행',
    img: new URL('@/assets/images/IbkIcon.png', import.meta.url).href,
  },
  {
    code: 'TS',
    label: '토스뱅크',
    img: new URL('@/assets/images/TossIcon.png', import.meta.url).href,
  },
  {
    code: 'WR',
    label: '우리은행',
    img: new URL('@/assets/images/WooriIcon.png', import.meta.url).href,
  },
  {
    code: 'HN',
    label: '하나은행',
    img: new URL('@/assets/images/HanaIcon.png', import.meta.url).href,
  },
  {
    code: 'KB',
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
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        @click="emit('close')"
      >
        ×
      </button>

      <div class="h-6 mb-6"></div>

      <div class="grid grid-cols-3 gap-3 mb-4">
        <div
          v-for="bank in banks"
          :key="bank.code"
          @click="selectBank(bank)"
          :class="[
            'w-24 h-24 flex flex-col items-center justify-center rounded-xl p-2 cursor-pointer transition-all duration-20 border text-xs text-center whitespace-nowrap',
            selectedBank === bank.code
              ? 'bg-[#D3DAE8] border-3 border-black text-[#54575C]'
              : 'bg-[#FAFAFB] border border-[#F4F4F4] hover:bg-[#D3DAE8] hover:border-4 hover:border-black hover:text-[#54575C]',
          ]"
        >
          <img :src="bank.img" alt="은행 로고" class="w-8 h-8 mb-1 object-contain" />
          <span>{{ bank.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
