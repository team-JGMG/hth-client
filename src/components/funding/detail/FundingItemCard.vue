<template>
  <div class="relative w-full">
    <FundingThumbnail :images="item.images" />
    <FundingOverview :item="item" />
    <FundingTabSection :item="item" />

    <!-- 하단 버튼 -->
    <div class="fixed inset-x-0 bottom-20 left-1/2 transform -translate-x-1/2 max-w-md w-full px-6">
      <BaseButton
        class="w-full py-3 text-m rounded-[10px] flex justify-center items-center text-center"
        :class="
          isLoggedIn
            ? '!bg-black text-white hover:bg-gray-900 cursor-pointer'
            : '!bg-gray-300 text-white cursor-not-allowed'
        "
        :disabled="!isLoggedIn"
        @click="goToTradePage"
      >
        {{ isLoggedIn ? '펀딩하기' : '로그인 후 펀딩하기' }}
      </BaseButton>
    </div>
  </div>
</template>
<script setup>
import FundingThumbnail from './thumbnail/FundingThumbnail.vue'
import FundingOverview from './overview/FundingOverview.vue'
import FundingTabSection from './tabSection/FundingTabSection.vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import { watch, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  item: { type: Object, required: true },
})

const router = useRouter()
const authStore = useAuthStore()

// ✅ 로그인 여부 가져오기 (getter가 있다면 그거 사용)
const isLoggedIn = computed(() => authStore.getIsLoggedIn ?? authStore.isLoggedIn)

// 이미지 없으면 기본 1장
const item = props.item
item.images = item.images?.length
  ? item.images
  : [{ photoUrl: '/src/assets/images/cardtestimage.png' }]

// 버튼 클릭 시 로그인 여부 확인 후 이동
function goToTradePage() {
  if (!isLoggedIn.value) {
    // 로그인 페이지로 이동하면서 현재 페이지를 redirect 파라미터에 저장
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }
  router.push(`/funding/trade/${item.fundingId}`)
}

// 최초/변경 시마다 확인용 콘솔
watch(
  () => props.item,
  (nv) => console.log('[ItemCard] props.item', nv),
  { immediate: true },
)
</script>
