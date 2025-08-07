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
        <BaseTypography v-if="accountInfo" size="base" color="gray-1">
          {{ bankName }} {{ accountInfo.accountNumber }} ({{ accountInfo.name }})
        </BaseTypography>
      </div>
    </div>

    <BaseTypography size="xs" color="red" class="text-center mt-6">
      환급 신청은 영업일 기준 1~2일 이내에 처리됩니다.<br />
      환급 시 소정의 수수료가 부과될 수 있습니다.
    </BaseTypography>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import { fetchUserInfo } from '@/api/auth' // ✅ API 재사용

const accountInfo = ref(null)

// 은행코드 → 이름 변환 맵
const bankCodeMap = {
  '004': '국민은행',
  '088': '신한은행',
  '003': '기업은행',
  '020': '우리은행',
  '081': '하나은행',
  '011': '농협은행',
  KB: '국민은행', // 백엔드가 문자열 코드일 경우도 대비
}

const bankName = computed(() => {
  if (!accountInfo.value) return ''
  return bankCodeMap[accountInfo.value.bankCode] || '알 수 없는 은행'
})

onMounted(async () => {
  try {
    const res = await fetchUserInfo()
    accountInfo.value = res.data
    console.log('받은 유저 정보:', res.data)
    console.log('accountNumber:', res.data.accountNumber)
    console.log(res.data)
  } catch (err) {
    console.error('유저 정보 불러오기 실패:', err)
  }
})
</script>
