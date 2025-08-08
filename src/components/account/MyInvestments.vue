<script setup>
import { ref, onMounted } from 'vue'
// import { useUserStore } from '@/store/user'
import {
  getUserFundingOrders,
  getUserShares,
  refundFundingOrder,
  getAllocations,
} from '@/api/funding'
import { formatAmount } from '@/utils/format'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CancelConfirmModal from '@/components/account/CancelConfirmModal.vue'
import DividendModal from './DividendModal.vue'
import NoInvestmentItems from './NoInvestmentItems.vue'

const isCancelLoading = ref(false)
const selectedOrder = ref(null) // ← 어떤 주문을 취소할지 담아둠
// const userStore = useUserStore()
const userId = ref(4) // 🐛 임시: 실제 연동 시 아래 줄로 교체
// const userId = userStore.userId

const isDividendModalOpen = ref(false)
const selectedBuildingName = ref('')
const selectedDividends = ref([])
const isDividendLoading = ref(false)
const openDividendModal = async (item) => {
  try {
    isDividendLoading.value = true
    selectedBuildingName.value = item.name
    selectedDividends.value = [] // 초기화

    // 1) 배당금 리스트 가져오기
    const res = await getAllocations(item.fundingId)
    const list = res.data?.data ?? []

    // 2) 모달 표시용으로 매핑
    selectedDividends.value = list.map((a) => ({
      // 모달에서 쓰고 싶은 포맷으로 맞춰주세요
      date: a.paymentDate, // "2025-09-06"
      perShare: a.dividendPerShare, // 주당 배당금
      total: a.totalDividendAmount, // 총 배당금
      status: a.paymentStatusKorean || a.paymentStatus, // 지급완료/지급예정
    }))

    isDividendModalOpen.value = true
  } catch (e) {
    console.error('배당금 조회 실패', e)
    alert('배당금 내역을 가져오지 못했습니다.')
  } finally {
    isDividendLoading.value = false
  }
}

const isModalOpen = ref(false)

const closeModal = () => (isModalOpen.value = false)

const openCancelModal = (item) => {
  const payload = {
    fundingId: item.fundingId,
    orderId: item.orderId,
    orderPrice: Number(item.orderPrice),
  }
  console.log('[refund payload prepared]', payload, 'raw item:', item)

  if (!payload.fundingId || !payload.orderId || !payload.orderPrice) {
    alert('환불에 필요한 주문 정보가 없습니다. (orderId/orderPrice) 서버 응답 필드를 확인하세요.')
    return
  }
  selectedOrder.value = payload
  isModalOpen.value = true
}
const confirmCancel = async () => {
  try {
    if (!selectedOrder.value) return
    isCancelLoading.value = true

    const { fundingId, orderId, orderPrice } = selectedOrder.value
    const res = await refundFundingOrder(fundingId, orderId, orderPrice)

    // 응답 예시: { code, message, status }  -> status === 'success' 기대
    if (res.data?.status === 'success') {
      // 화면에서 해당 아이템 제거
      fundingItems.value = fundingItems.value.filter((x) => x.orderId !== orderId)
    } else {
      console.warn('환불 응답:', res.data)
      alert(res.data?.message || '환불 처리에 실패했습니다.')
    }
  } catch (e) {
    console.error('환불 실패', e)
    alert('환불 처리 중 오류가 발생했습니다.')
  } finally {
    isCancelLoading.value = false
    isModalOpen.value = false
    selectedOrder.value = null
  }
}
const fundingItems = ref([])
const ownedItems = ref([])

// ✅ 응답 구조 안전하게 꺼내는 함수
function pickShareList(resData) {
  if (Array.isArray(resData?.data)) return resData.data
  if (Array.isArray(resData)) return resData
  return resData?.data?.content ?? resData?.content ?? []
}

// ✅ API 호출
onMounted(async () => {
  try {
    const [fundingRes, shareRes] = await Promise.all([
      getUserFundingOrders(userId.value, 'pending', 0, 10),
      getUserShares(userId.value, 0, 10),
    ])

    const fundingData = fundingRes.data?.data?.content ?? []
    console.log('[orders RAW sample]', fundingData[0]) // ← 요거 추가
    fundingItems.value = fundingData.map((item) => ({
      // ✅ 환불 API용(실제 키 확인 후 하나로 확정해 주세요)
      fundingId: item.fundingId ?? item.funding?.id ?? item.fundingID ?? item.funding_id,
      orderId: item.orderId ?? item.fundingOrderId ?? item.id ?? item.orderID ?? item.order_id,
      orderPrice: Number(
        item.orderPrice ??
          item.orderAmount ??
          item.totalAmount ??
          item.totalPrice ??
          item.amount ??
          item.paidAmount ??
          item.price ??
          0,
      ),

      // 👇 화면 표시용
      name: item.title ?? '',
      percent: Number(item.achievementRate ?? 0),
      left: Number(item.remainingShares ?? 0),
      total: Number(item.targetAmount ?? 0),
      img: item.thumbnail?.photoUrl
        ? `https://half-to-half.site${item.thumbnail.photoUrl}`
        : '/default-img.png',
      status: item.status === 'refunded' ? '펀딩 만료' : '펀딩 중',
    }))
    console.log('[mapped order sample]', fundingItems.value[0]) // ← 확인
    // ✅ 보유 지분 리스트 꺼내기
    const shareList = pickShareList(shareRes.data)
    // 한 번 확인해보기
    console.log('[shares RAW sample]', shareList[0])

    ownedItems.value = shareList.map((item) => ({
      // ⬇️ allocations 호출에 꼭 필요
      fundingId: item.fundingId ?? item.funding?.id ?? item.fundingID ?? item.funding_id,

      name: item.propertyTitle ?? item.title ?? '',
      ownedAmount: Number(item.shareCount ?? 0),
      avgPrice: Number(item.averageAmount ?? 0),
      price: Number(item.currentShareAmount ?? 0),
      img: item.thumbnailUrl || '/default-img.png',
      status: '보유 중',
    }))

    console.log('[shares] list:', ownedItems.value)
  } catch (error) {
    console.error('❌ 투자 목록 불러오기 실패:', error)
    if (error.response) {
      console.error('status:', error.response.status, 'data:', error.response.data)
    }
  }
})
</script>
<template>
  <div class="p-4 min-h-[600px]">
    <NoInvestmentItems v-if="!fundingItems.length && !ownedItems.length" />

    <!-- 🏗 펀딩 중인 매물 -->
    <div v-if="fundingItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">펀딩 중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in fundingItems"
        :key="idx"
        class="flex justify-between bg-white rounded-lg border px-3 py-2"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">
              {{ item.name }}
            </BaseTypography>
            <BaseTypography class="text-xs !text-gray-500 mt-1">10주 보유</BaseTypography>

            <div class="flex items-center mt-1">
              <div class="w-1/2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-indigo-500 transition-all duration-300"
                  :style="{ width: item.percent + '%' }"
                ></div>
              </div>
              <BaseTypography class="text-xs !font-extrabold !text-indigo-500 ml-2">
                {{ item.percent }}%
              </BaseTypography>
            </div>

            <BaseTypography class="text-xs !text-gray-500 mt-1">
              남은 주(금액): {{ item.left.toLocaleString() }} / {{ formatAmount(item.total) }}
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full">
          <div class="h-14"></div>

          <BaseButton
            v-if="item.status === '펀딩 만료'"
            disabled
            class="text-xs bg-gray-300 text-white rounded-md px-3 py-2 cursor-not-allowed"
          >
            <span class="text-xs font-medium">기간만료</span>
          </BaseButton>

          <BaseButton
            v-else
            @click="openCancelModal(item)"
            variant="danger"
            class="text-xs text-white rounded-md px-3 py-2 hover:bg-[#e63232] transition-colors duration-150"
          >
            <span class="text-xs font-medium">취소하기</span>
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 📦 보유중인 매물 -->
    <div v-if="ownedItems.length" class="space-y-4 mb-6">
      <BaseTypography class="text-lg !font-bold mb-2">보유중인 매물</BaseTypography>

      <div
        v-for="(item, idx) in ownedItems"
        :key="idx"
        class="flex justify-between bg-white rounded-lg border px-3 py-2"
      >
        <div class="flex items-center">
          <img :src="item.img" alt="매물" class="w-16 h-16 object-cover rounded-md mr-3" />
          <div>
            <BaseTypography class="font-semibold text-sm !font-bold">
              {{ item.name }}
            </BaseTypography>
            <BaseTypography class="text-xs !text-gray-500 mt-1">
              보유 주 수량: {{ item.ownedAmount }}주
            </BaseTypography>
            <BaseTypography class="text-xs !text-gray-400 mt-0.5">
              평단가: {{ formatAmount(item.avgPrice) }}원
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full">
          <BaseButton
            variant="secondary"
            @click="openDividendModal(item)"
            class="text-xs px-0.5 mb-1 !py-0.5"
          >
            <BaseTypography class="text-[10px] font-medium !text-white px-1">
              {{ '내 배당금' }}
            </BaseTypography>
          </BaseButton>

          <BaseTypography class="text-xs text-gray-500 mb-0.5">현재 시세</BaseTypography>

          <BaseTypography class="text-base font-semibold" style="color: #ff3b3b">
            {{ formatAmount(item.price) }}원
          </BaseTypography>
        </div>
      </div>
    </div>
  </div>

  <!-- 배당금 & 취소 모달 -->
  <DividendModal
    :isOpen="isDividendModalOpen"
    :buildingName="selectedBuildingName"
    :dividends="selectedDividends"
    @close="isDividendModalOpen = false"
  />
  <CancelConfirmModal :isOpen="isModalOpen" @close="closeModal" @submit="confirmCancel" />
</template>
