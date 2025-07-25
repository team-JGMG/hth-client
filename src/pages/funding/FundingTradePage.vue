<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- 상단 콘텐츠 영역 (스크롤) -->
    <div class="flex-1 p-4 pb-32 overflow-y-auto">
      <!-- 헤더 -->
      <DetailHeader>
        <BaseTypography tag="h2" size="base" weight="semibold" class="mb-3">
          {{ item.title || '매물 제목 없음' }}
        </BaseTypography>
      </DetailHeader>

      <!-- 주당 가격 -->
      <div class="flex justify-between items-center text-sm text-black font-medium mb-4">
        <BaseTypography size="sm" weight="medium">주당 가격</BaseTypography>
        <BaseTypography weight="bold">
          {{ item.orderPricePerShare?.toLocaleString() || 0 }}원/주
        </BaseTypography>
      </div>

      <!-- 수량 선택 버튼 -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        <BaseButton
          class="w-full h-9 flex items-center justify-center px-2 border border-gray-300 rounded-[10px] bg-white text-sm text-black font-semibold hover:bg-gray-100 cursor-pointer"
          @click="addShares(1)"
          >+1주</BaseButton
        >
        <BaseButton
          class="w-full h-9 flex items-center justify-center px-2 border border-gray-300 rounded-[10px] bg-white text-sm text-black font-semibold hover:bg-gray-100 cursor-pointer"
          @click="addShares(10)"
          >+10주</BaseButton
        >
        <BaseButton
          class="w-full h-9 flex items-center justify-center px-2 border border-gray-300 rounded-[10px] bg-white text-sm text-black font-semibold hover:bg-gray-100 cursor-pointer"
          @click="addShares(50)"
          >+50주</BaseButton
        >
        <BaseButton
          class="w-full h-9 flex items-center justify-center px-2 border border-gray-300 rounded-[10px] bg-white text-sm text-black font-semibold hover:bg-gray-100 cursor-pointer"
          @click="addShares(100)"
          >+100주</BaseButton
        >
      </div>

      <!-- 수량 입력 필드 -->
      <div class="relative mb-3">
        <input
          type="number"
          v-model="quantity"
          min="0"
          placeholder="구매할 수량(주)을 입력해주세요."
          class="w-full h-10 border border-gray-300 rounded-[10px] px-4 pr-8 text-sm text-black placeholder:text-gray-500 appearance-none"
        />
        <span class="absolute right-4 top-2.5 text-gray-400 text-xs pointer-events-none"></span>
      </div>

      <!-- 총 가격 -->
      <div
        class="w-full h-10 border border-gray-300 bg-gray-50 rounded-[10px] px-4 flex items-center mb-6"
      >
        <BaseTypography size="sm" weight="bold" class="text-black">
          ₩ {{ totalPrice.toLocaleString() }}
        </BaseTypography>
      </div>

      <!-- 투자 가능 현황 카드 -->
      <div class="bg-gray-50 rounded-xl border border-gray-300 p-4">
        <BaseTypography size="sm" class="mb-3 font-bold">투자 가능 현황</BaseTypography>
        <div class="py-3"></div>
        <!-- 현재 보유 주 -->
        <div class="flex justify-between text-sm mb-2">
          <BaseTypography size="sm" class="font-semibold">현재 보유 주</BaseTypography>
          <BaseTypography size="sm" weight="medium" class="text-right">
            {{ userShares }}주 ({{ (userShares * item.orderPricePerShare).toLocaleString() }}원)
          </BaseTypography>
        </div>

        <!-- 보유 포인트 -->
        <div class="flex justify-between items-start mb-3">
          <BaseTypography class="text-xl font-bold">
            <div class="flex items-center space-x-2">
              <img :src="moneyIcon" alt="money icon" class="w-5 h-5" />
              <span>보유 포인트</span>
            </div>
          </BaseTypography>
          <div class="text-right">
            <BaseTypography class="text-xl font-bold">
              {{ userPoints.toLocaleString() }}원
            </BaseTypography>
            <BaseButton
              class="ml-2 px-2 py-2 rounded-[10px] bg-gray-800 text-white hover:bg-gray-700 text-sm mt-1 cursor-pointer"
              @click="handleCharge"
            >
              <BaseTypography size="sm" weight="semibold">충전하기</BaseTypography>
            </BaseButton>
            <div class="py-1"></div>
            <div class="grid grid-cols-2 gap-x-4 text-xs mt-1 text-gray-500 font-bold">
              <BaseTypography class="text-blue-600 flex items-baseline justify-end w-[100px]">
                <span class="inline-block w-[60px] text-right [font-variant-numeric:tabular-nums]">
                  +{{ quantity }}
                </span>
                <span class="ml-1">주</span>
              </BaseTypography>

              <!-- -원 -->
              <div class="flex justify-end text-red-500">
                <span class="inline-block text-right"
                  >-{{ totalPrice.toLocaleString() }}<span class="ml-1">원</span></span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 예측 정보 -->
        <div class="border-t pt-3 mt-3 text-base">
          <div class="flex justify-between mb-2">
            <BaseTypography size="base" weight="medium" class="text-gray-600">
              예상 잔여 포인트
            </BaseTypography>
            <BaseTypography class="font-bold">
              {{ userPoints - totalPrice >= 0 ? (userPoints - totalPrice).toLocaleString() : 0 }}원
            </BaseTypography>
          </div>
          <div class="flex justify-between">
            <BaseTypography size="base" weight="medium" class="text-gray-600">
              예상 총 보유 주
            </BaseTypography>
            <BaseTypography class="font-bold">
              {{ userShares + Number(quantity) }}주 ({{
                ((userShares + Number(quantity)) * item.orderPricePerShare).toLocaleString()
              }}원)
            </BaseTypography>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 하단 고정 버튼 바 -->
    <div class="fixed bottom-0 left-0 w-full border-gray-200">
      <div class="max-w-md mx-auto px-4 pt-3 pb-6">
        <div class="flex flex-col w-full gap-2">
          <!-- 초기화 버튼 -->
          <BaseButton
            class="w-full py-3 bg-white border-gray-300 text-gray-800 text-sm font-medium rounded-[10px] flex items-center justify-center gap-1"
            @click="handleReset"
          >
            <img src="@/assets/images/refresh.png" alt="초기화" class="w-4 h-4 cursor-pointer" />
            <BaseTypography class="cursor-pointer">초기화</BaseTypography>
          </BaseButton>
          <!-- 펀딩하기 버튼 -->
          <BaseButton
            class="w-full py-3 bg-black text-white text-sm font-semibold rounded-[10px] hover:bg-gray-900 flex justify-center items-center text-center cursor-pointer"
            @click="handleFunding"
          >
            펀딩하기
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockItems } from '@/pages/funding/mockData'
import DetailHeader from '@/layouts/DetailHeader.vue'

const route = useRoute()
const itemId = Number(route.params.id)
const item = mockItems.find((f) => f.propertyId === itemId) || {
  title: '알 수 없음',
  orderPricePerShare: 0,
}

const quantity = ref('')
const userPoints = 60000
const userShares = 2

const totalPrice = computed(() => Number(quantity.value || 0) * item.orderPricePerShare)

const addShares = (n) => {
  quantity.value = Number(quantity.value || 0) + n
}
const handleReset = () => {
  quantity.value = '' // 또는 '0'
}
const handleCharge = () => {
  console.log('충전하기 클릭됨')
}
const moneyIcon = new URL('@/assets/images/moneyIcon.png', import.meta.url).href

const handleFunding = () => {
  console.log('펀딩하기 클릭됨')
}
</script>
