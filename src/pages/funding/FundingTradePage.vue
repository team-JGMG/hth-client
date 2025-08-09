<template>
  <div class="min-h-screen flex flex-col bg-white">
    <!-- 상단 콘텐츠 영역 (스크롤) -->
    <div class="flex-1 p-4 pb-32 overflow-y-auto">
      <!-- 헤더 -->
      <DetailHeader>
        <BaseTypography tag="h2" size="2xl" weight="semibold" class="text-2xl">
          {{ item.title || '매물 제목 없음' }}
        </BaseTypography>
      </DetailHeader>

      <!-- 주당 가격 -->
      <div class="flex justify-between items-center text-sm text-black font-medium mb-4">
        <BaseTypography size="sm" weight="medium">주당 가격</BaseTypography>
        <BaseTypography weight="bold">
          {{ item.orderPricePerShare?.toLocaleString() || 5000 }}원/주
        </BaseTypography>
      </div>

      <div class="flex justify-between gap-2 mb-4">
        <BaseButton
          variant="outline"
          class="flex-1 h-10 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition"
          @click="addShares(1)"
        >
          +1주
        </BaseButton>
        <BaseButton
          variant="outline"
          class="flex-1 h-10 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition"
          @click="addShares(10)"
        >
          +10주
        </BaseButton>
        <BaseButton
          variant="outline"
          class="flex-1 h-10 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition"
          @click="addShares(50)"
        >
          +50주
        </BaseButton>
        <BaseButton
          variant="outline"
          class="flex-1 h-10 !border-gray-200 !text-black !bg-white font-semibold rounded-[10px] hover:!bg-gray-100 transition"
          @click="addShares(100)"
        >
          +100주
        </BaseButton>
      </div>

      <!-- 수량 입력 필드 -->
      <div class="relative mb-3">
        <input
          type="number"
          v-model="quantity"
          min="0"
          placeholder="구매할 수량(주)을 입력해주세요."
          class="w-full h-10 border-2 border-gray-200 rounded-[10px] px-4 pr-8 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
        <span class="absolute right-4 top-2.5 text-gray-600 text-xs pointer-events-none"></span>
      </div>

      <!-- 총 가격 -->
      <div class="w-full h-10 bg-gray-200 rounded-[10px] px-4 flex items-center mb-6">
        <BaseTypography size="sm" class="font-semibold">
          ₩ {{ totalPrice.toLocaleString() }}
        </BaseTypography>
      </div>

      <!-- 투자 가능 현황 카드 -->
      <div class="bg-gray-50 rounded-xl border border-gray-300 p-4">
        <BaseTypography size="sm" class="mb-3 !font-semibold text-xl"
          >투자 가능 현황</BaseTypography
        >
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
          <div class="flex items-center space-x-2">
            <img :src="moneyIcon" alt="money icon" class="w-5 h-5" />
            <BaseTypography class="text-xl !font-bold">보유 포인트</BaseTypography>
          </div>

          <div class="text-right">
            <div class="flex items-center space-x-2 justify-end">
              <BaseTypography class="text-xl font-bold">
                {{ userPoints.toLocaleString() }}원
              </BaseTypography>
              <BaseButton
                variant="secondary"
                class="px-2 py-1 rounded-[10px] text-white hover:bg-gray-700 text-sm cursor-pointer"
                @click="handleCharge"
              >
                <BaseTypography size="sm" class="!text-white">충전하기</BaseTypography>
              </BaseButton>
            </div>

            <!-- 💡 수량 및 금액 변화 표시 -->
            <div class="flex justify-between items-center gap-4 text-sm mt-2 font-bold">
              <BaseTypography class="!text-blue-600"> +{{ quantity || 0 }}주 </BaseTypography>
              <BaseTypography class="!text-red-500">
                -{{ totalPrice.toLocaleString() }}원
              </BaseTypography>
            </div>
          </div>
        </div>

        <!-- 예측 정보 -->
        <div class="border-t pt-3 mt-3 text-base">
          <div class="flex justify-between mb-2">
            <BaseTypography size="base" weight="medium" class="!text-gray-600">
              예상 잔여 포인트
            </BaseTypography>
            <BaseTypography class="!font-bold">
              {{ userPoints - totalPrice >= 0 ? (userPoints - totalPrice).toLocaleString() : 0 }}원
            </BaseTypography>
          </div>
          <div class="flex justify-between">
            <BaseTypography size="base" weight="medium" class="!text-gray-600">
              예상 총 보유 주
            </BaseTypography>
            <BaseTypography class="!font-bold">
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
            class="w-full py-3 bg-white border-gray-300 text-gray-800 text-sm font-medium rounded-[10px] flex items-center justify-center gap-1 hover:bg-white"
            @click="handleReset"
          >
            <img src="@/assets/images/refresh.png" alt="초기화" class="w-4 h-4 cursor-pointer" />
            <BaseTypography class="cursor-pointer">초기화</BaseTypography>
          </BaseButton>
          <!-- 펀딩하기 버튼 -->
          <BaseButton
            class="w-full py-3 !bg-black text-white text-m rounded-[10px] hover:bg-gray-900 flex justify-center items-center text-center cursor-pointer"
            @click="handleFunding"
          >
            펀딩하기
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
  <!-- 확인 모달 -->
  <BaseModal :isOpen="showConfirmModal" @close="showConfirmModal = false">
    <template #default>
      <div class="p-4 pb-0">
        <BaseTypography class="mb-4" size="xl" weight="bold">
          선택하신 수량으로 펀딩을 진행하시겠습니까?
        </BaseTypography>
        <BaseTypography size="base" color="gray-1" class="text-start mb-0">
          <br />
          주당 가격: 5,000원/주
          <br />
          구매 수량: {{ quantity }}주
          <br />
          총 펀딩금액: {{ totalPrice.toLocaleString() }}원
          <br />
          예상 잔여 포인트: {{ userPoints.toLocaleString() }}
        </BaseTypography>
      </div>
    </template>
    <template #submit>
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleFinalSubmit"
      >
        펀딩하기
      </CompletedButton>
    </template>
  </BaseModal>

  <!-- 완료 모달 -->
  <CompletedModal
    :isOpen="showCompleteModal"
    @close="showCompleteModal = false"
    @submit="goToMyPage"
  >
    펀딩이 완료되었습니다.

    <template #submitText> 닫기 </template>
  </CompletedModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockItems } from '@/pages/funding/mockData'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BaseModal from '@/components/common/Modal/BaseModal.vue'
import CompletedModal from '@/components/common/Modal/CompletedModal.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'

const showConfirmModal = ref(false)
const showCompleteModal = ref(false)
const route = useRoute()
const itemId = Number(route.params.id)
const item = mockItems.find((f) => f.propertyId === itemId) || {
  title: '알 수 없음',
  orderPricePerShare: 5000,
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
  showConfirmModal.value = true
}

const handleFinalSubmit = () => {
  showConfirmModal.value = false
  showCompleteModal.value = true
}

const goToMyPage = () => {
  console.log('마이페이지로 이동') // router.push('/account/my-page') 등으로 변경 가능
}

const isStepValid = computed(() => Number(quantity.value) > 0)
</script>
<style scoped>
/* Webkit 기반 브라우저용: 검은 화살표 크게 표시 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  width: 24px;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg fill='black' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5-5 5 5H7zm0 4h10l-5 5-5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  opacity: 1 !important;
  cursor: pointer;
}
</style>
