<template>
  <div class="relative w-full">
    <FundingThumbnail :images="item.images" />
    <FundingOverview :item="item" />
    <FundingTabSection :item="item" />

    <!-- 하단 버튼 -->
    <div class="fixed inset-x-0 bottom-20 left-1/2 -translate-x-1/2 max-w-md w-full px-6">
      <BaseButton
        class="w-full py-3 text-m rounded-[10px] flex justify-center items-center text-center"
        :class="
          ctaDisabled
            ? '!bg-gray-300 text-white cursor-not-allowed'
            : '!bg-black text-white hover:bg-gray-900 cursor-pointer'
        "
        :disabled="ctaDisabled"
        @click="handleCTA"
      >
        {{ ctaText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import FundingThumbnail from './thumbnail/FundingThumbnail.vue'
import FundingOverview from './overview/FundingOverview.vue'
import FundingTabSection from './tabSection/FundingTabSection.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  item: { type: Object, required: true },
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 로그인 여부 (getter 있으면 우선 사용)
const isLoggedIn = computed(() => authStore.getIsLoggedIn ?? authStore.isLoggedIn)

// 이미지 없으면 기본 1장
const item = props.item
item.images = item.images?.length
  ? item.images
  : [{ photoUrl: '/src/assets/images/cardtestimage.png' }]

// props 변이 방지 + 이미지 기본값 보정
const safeItem = computed(() => ({
  ...props.item,
  images: props.item?.images?.length
    ? props.item.images
    : [{ photoUrl: '/src/assets/images/cardtestimage.png' }],
}))

// stage: 라우트 쿼리 우선, 없으면 휴리스틱
const stageFromRoute = computed(() => route.query.stage) // 'inProgress' | 'completedFunding' | 'completedSale'
const stage = computed(() => {
  if (stageFromRoute.value) return String(stageFromRoute.value)
  const i = safeItem.value
  if (i.isSold || i.saleCompleted) return 'completedSale'
  if (i.status === 'ENDED' || i.fundingStatus === 'ended' || i.daysLeft <= 0 || i.percent >= 100) {
    return 'completedFunding'
  }
  return 'inProgress'
})

// 버튼 문구/활성
const ctaText = computed(() => {
  if (stage.value === 'completedSale') return '매각완료'
  if (stage.value === 'completedFunding')
    return isLoggedIn.value ? '거래하기' : '로그인 후 거래하기'
  return isLoggedIn.value ? '펀딩하기' : '로그인 후 펀딩하기'
})

const ctaDisabled = computed(() => {
  if (stage.value === 'completedSale') return true
  return !isLoggedIn.value
})

// 버튼 동작
function handleCTA() {
  if (ctaDisabled.value) return

  if (!isLoggedIn.value) {
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  const i = safeItem.value

  if (stage.value === 'completedFunding') {
    // 펀딩 완료 → 거래하기
    router.push(`/trade/order/${i.fundingId}`)
  } else {
    // 모집 중 → 펀딩하기 (기존 경로 유지)
    router.push(`/funding/trade/${i.fundingId}`)
  }
}
</script>
