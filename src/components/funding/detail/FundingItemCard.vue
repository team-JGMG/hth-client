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
      :color="black"
      :text-color="white"
      class="w-full max-w-[340px] fixed bottom-20 left-1/2 transform -translate-x-1/2"
      @click="goToTradePage"
    >
      펀딩하기
    </CompletedButton>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import FundingThumbnail from './thumbnail/FundingThumbnail.vue'
import FundingOverview from './overview/FundingOverview.vue'
import FundingTabSection from './tabSection/FundingTabSection.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import { mockItems } from '@/pages/funding/mockData'

const router = useRouter()
const route = useRoute()

const itemId = Number(route.params.id)
const item = mockItems.find((f) => f.propertyId === itemId) || {}

// 기본 이미지 설정
item.images = item.images || [
  { photoUrl: '/src/assets/images/cardtestimage.png' },
  { photoUrl: '/src/assets/images/sample-buliding.png' },
  { photoUrl: '/src/assets/images/mockup.png' },
]

function goToTradePage() {
  const id = item.propertyId
  if (item.status === 'PENDING') {
    router.push(`/trade/${id}`)
  } else if (item.status === 'FUNDING') {
    router.push(`/funding/trade/${id}`)
  } else {
    alert('현재 거래 가능한 상태가 아닙니다.')
  }
}
</script>
