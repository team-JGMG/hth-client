<script setup>
import { ref, onMounted } from 'vue'
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

/** ---------------- 상태 ---------------- **/
const userId = ref(3)
const fundingItems = ref([])
const ownedItems = ref([])

const isModalOpen = ref(false)
const isCancelLoading = ref(false)
const selectedOrder = ref(null)

const isDividendModalOpen = ref(false)
const isDividendLoading = ref(false)
const selectedBuildingName = ref('')
const selectedDividends = ref([])

function toImg(src) {
  if (!src) return '/default-img.png'
  return /^https?:\/\//i.test(src) ? src : `https://half-to-half.site${src}`
}

const openDividendModal = async (item) => {
  try {
    isDividendLoading.value = true
    selectedBuildingName.value = item.name
    selectedDividends.value = []

    const res = await getAllocations(item.fundingId)
    const root = res?.data
    const list = Array.isArray(root?.data?.content)
      ? root.data.content
      : Array.isArray(root?.data)
        ? root.data
        : Array.isArray(root)
          ? root
          : []

    selectedDividends.value = list.map((a) => ({
      date: a.paymentDate,
      perShare: a.dividendPerShare,
      total: a.totalDividendAmount,
      status: a.paymentStatusKorean || a.paymentStatus,
    }))

    isDividendModalOpen.value = true
  } catch (e) {
    console.error('배당금 조회 실패', e)
    alert('배당금 내역을 가져오지 못했습니다.')
  } finally {
    isDividendLoading.value = false
  }
}

const openCancelModal = (item) => {
  const payload = {
    fundingId: item.fundingId,
    orderId: item.orderId,
    orderPrice: Number(item.orderPrice),
  }
  if (!payload.fundingId || !payload.orderId || !payload.orderPrice) {
    alert('환불에 필요한 주문 정보가 없습니다. (fundingId / orderId / orderPrice)')
    return
  }
  selectedOrder.value = payload
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedOrder.value = null
}

const confirmCancel = async () => {
  try {
    if (!selectedOrder.value) return
    isCancelLoading.value = true

    const { fundingId, orderId, orderPrice } = selectedOrder.value
    const res = await refundFundingOrder(fundingId, orderId, orderPrice)

    if (res?.data?.status === 'success') {
      // 환불 성공 시 목록에서 제거
      fundingItems.value = fundingItems.value.filter((x) => x.orderId !== orderId)
      alert('주문이 취소(환불)되었습니다.')
    } else {
      console.warn('환불 응답:', res?.data)
      alert(res?.data?.message || '환불 처리에 실패했습니다.')
    }
  } catch (e) {
    console.error('환불 실패', e)
    alert('환불 처리 중 오류가 발생했습니다.')
  } finally {
    isCancelLoading.value = false
    closeModal()
  }
}

onMounted(async () => {
  try {
    const [pendingRes, refundedRes, shareRes] = await Promise.all([
      getUserFundingOrders(userId.value, 'pending', 0, 10),
      getUserFundingOrders(userId.value, 'refunded', 0, 10),
      getUserShares(userId.value, 0, 10),
    ])

    const pending = pendingRes?.data?.data?.content ?? []
    const refunded = refundedRes?.data?.data?.content ?? []
    const fundingData = [...pending, ...refunded]

    // ✅ refunded 건 제외
    fundingItems.value = fundingData
      .filter(
        (item) =>
          String(item.status ?? 'pending')
            .trim()
            .toLowerCase() !== 'refunded',
      )
      .map((item) => {
        const normalized = String(item.status ?? 'pending')
          .trim()
          .toLowerCase()
        return {
          fundingId: item.fundingId,
          orderId: item.orderId,
          orderPrice: Number(item.orderPrice ?? 0),
          name: item.title ?? '',
          percent: Number(item.achievementRate ?? 0),
          left: Number(item.remainingShares ?? item.remainingAmount ?? 0),
          total: Number(item.targetAmount ?? 0),
          img: toImg(item.thumbnail?.photoUrl),
          status: normalized,
          shareCount: Number(item.shareCount ?? 0),
        }
      })

    const shareList = shareRes?.data?.data?.content ?? []
    ownedItems.value = shareList.map((item) => ({
      fundingId: item.fundingId ?? item.funding?.id,
      name: item.propertyTitle ?? item.title ?? '',
      ownedAmount: Number(item.shareCount ?? 0),
      avgPrice: Number(item.averageAmount ?? 0),
      price: Number(item.currentShareAmount ?? item.currentAmount ?? 0),
      img: toImg(item.thumbnailUrl ?? item.thumbnail?.photoUrl),
      status: '보유 중',
    }))
  } catch (e) {
    console.error('❌ 투자 목록 불러오기 실패:', e)
    if (e.response) console.error('status:', e.response.status, 'data:', e.response.data)
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

            <BaseTypography v-if="item.shareCount" class="text-xs !text-gray-500 mt-1">
              보유 수량: {{ item.shareCount }}주
            </BaseTypography>

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
              남은 주(금액): {{ Number(item.left).toLocaleString() }} /
              {{ formatAmount(item.total) }}
            </BaseTypography>
          </div>
        </div>

        <div class="flex flex-col justify-between items-end ml-2 h-full">
          <div class="h-14"></div>

          <!-- 상태별 버튼: pending → 취소하기 / refunded → 거래 만료 -->
          <BaseButton
            v-if="item.status === 'pending'"
            :disabled="isCancelLoading && selectedOrder?.orderId === item.orderId"
            @click="openCancelModal(item)"
            variant="danger"
            class="text-xs text-white rounded-md px-3 py-2 hover:bg-[#e63232] transition-colors duration-150"
          >
            <span class="text-xs font-medium">
              {{
                isCancelLoading && selectedOrder?.orderId === item.orderId
                  ? '취소 중...'
                  : '취소하기'
              }}
            </span>
          </BaseButton>

          <BaseButton
            v-else-if="item.status === 'refunded'"
            disabled
            class="text-xs bg-gray-300 text-white rounded-md px-3 py-2 cursor-not-allowed"
          >
            <span class="text-xs font-medium">거래 만료</span>
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
              내 배당금
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

  <!-- ✅ 환불 확인 모달 -->
  <CancelConfirmModal :isOpen="isModalOpen" @close="closeModal" @submit="confirmCancel" />
</template>
