<template>
  <BaseLayout>
    <div class="mb-4">
      <div class="bg-black rounded-2xl p-6 text-white">
        <BaseTypography class="text-xl mb-1" color="white">{{}}님,</BaseTypography>

        <div class="flex items-baseline justify-between mb-4">
          <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
          <BaseTypography class="text-xl font-medium" color="white">{{}}원</BaseTypography>
        </div>
        <div class="flex space-x-3 mb-4">
          <button class="flex-1 bg-green-400 text-black py-3 rounded-xl font-medium">
            <span class="material-symbols-outlined text-2xl">add</span>
            <br />
            <BaseTypography class="font-bold">포인트 충전</BaseTypography>
          </button>
          <button class="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-medium">
            <span class="material-symbols-outlined text-2xl">remove</span><br />
            <BaseTypography class="font-bold">포인트 환급</BaseTypography>
          </button>
        </div>
        <BaseCard class="h-6 flex justify-between items-center px-6"
          ><BaseTypography class="font-medium">포인트 관리하러 가기</BaseTypography>
          <button
            class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
            @click="myPage"
            aria-label="투자매물 탐색하기"
          >
            <span class="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </BaseCard>
      </div>
    </div>

    <BaseCard class="h-26 flex justify-between items-center px-6 mb-4">
      <BaseTypography class="text-left leading-tight">
        지금 바로 반의반집의 다양한<br />
        <span class="bg-yellow-200 rounded px-1">투자 매물</span>을 탐색해보세요!
      </BaseTypography>

      <button
        class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
        @click="fundingListPage"
        aria-label="투자매물 탐색하기"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>
    </BaseCard>
    <BaseCard class="h-auto pb-6 mb-6">
      <div class="flex justify-between items-center px-6 mb-6">
        <BaseTypography class="text-left leading-tight">
          보유 매물을 등록하고 <br />
          새로운 가치를 만들어 보세요!
        </BaseTypography>
        <button
          class="w-8 h-8 flex justify-end items-center text-black active:bg-gray-100 rounded-full transition-colors"
          @click="propertyPage"
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
    <div class="px-4 mb-20">
      <BaseTypography class="text-xl font-medium mb-4">매각 완료</BaseTypography>
      <div
        ref="cardContainer"
        class="card-container overflow-x-auto flex space-x-4 pb-2"
        @mousedown="startDrag"
        @mouseleave="stopDrag"
        @mouseup="stopDrag"
        @mousemove="doDrag"
        @touchstart="startTouch"
        @touchmove="doTouchMove"
        @touchend="stopDrag"
      >
        <div class="card-item w-32 flex-shrink-0">
          <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
            <BaseCard
              class="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-50"
            ></BaseCard>
            <div class="relative">
              <div class="text-xs opacity-75 mb-2">아파트</div>
              <div class="text-lg font-bold">+78%</div>
            </div>
          </div>
        </div>
        <div class="card-item w-32 flex-shrink-0">
          <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 opacity-50"
            ></div>
            <div class="relative">
              <div class="text-xs opacity-75 mb-2">투자 수익률</div>
              <div class="text-lg font-bold">+9.72%</div>
            </div>
          </div>
        </div>
        <div class="card-item w-32 flex-shrink-0">
          <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 opacity-50"
            ></div>
            <div class="relative">
              <div class="text-xs opacity-75 mb-2">투자 수익률</div>
              <div class="text-lg font-bold">+5.50%</div>
            </div>
          </div>
        </div>
        <div class="card-item w-32 flex-shrink-0">
          <div class="bg-gray-900 rounded-xl p-4 text-white relative overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 opacity-50"
            ></div>
            <div class="relative">
              <div class="text-xs opacity-75 mb-2">오피스텔</div>
              <div class="text-lg font-bold">+12.3%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import BaseLayout from '@/layouts/BaseLayout.vue'
import BaseCard from '@/components/common/Card/BaseCard.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const router = useRouter()

const fundingListPage = () => {
  router.push('/funding/list')
}

// const tradeListPage = () => {
//   router.push('/trade/list')
// }

const propertyPage = () => {
  router.push('/property/register')
}

const myPage = () => {
  router.push('/account/my-page')
}
</script>
