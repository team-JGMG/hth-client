<template>
  <div class="relative w-full">
    <!-- 썸네일 -->
    <FundingThumbnail :images="item.images" />

    <!-- 개요 정보 -->
    <FundingOverview :item="item" />

    <!-- 탭 섹션 -->
    <FundingTabSection :item="item" />

    <!-- 하단 버튼 -->
    <CompletedButton
      color="black"
      class="w-full max-w-[340px] fixed bottom-20 left-1/2 transform -translate-x-1/2"
      @click="goToTradePage"
    >
      펀딩하기
    </CompletedButton>
  </div>
</template>

<script setup>
import FundingThumbnail from './thumbnail/FundingThumbnail.vue'
import FundingOverview from './overview/FundingOverview.vue'
import FundingTabSection from './tabSection/FundingTabSection.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

// 이미지 없으면 기본 1~2장
const item = props.item
item.images =
  item.images && item.images.length
    ? item.images
    : [{ photoUrl: '/src/assets/images/cardtestimage.png' }]

function goToTradePage() {
  const id = item.propertyId
  // 일단 펀딩 거래 페이지로 이동하는 기본 라우팅만:
  router.push(`/funding/trade/${id}`)
}

// TODO: 백엔드에서 status 내려주면 분기, 없으면 daysLeft 등으로 분기
// function goToTradePage() {
//   const id = item.propertyId
//   if (item.status === 'PENDING') {
//     router.push(`/trade/${id}`)
//   } else if (item.status === 'FUNDING') {
//     router.push(`/funding/trade/${id}`)
//   } else {
//     alert('현재 거래 가능한 상태가 아닙니다.')
//   }
// }

// 최초/변경 시마다 찍기
watch(
  () => props.item,
  (nv) => {
    console.log('[ItemCard] props.item', nv)
  },
  { immediate: true },
)
</script>
