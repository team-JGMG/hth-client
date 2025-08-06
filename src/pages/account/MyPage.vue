<!-- myPage.vue -->
<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import LogoutSection from '@/components/account/LogoutSection.vue'

import LoggedInPointSection from '@/components/main/PointSection/LoggedInPointSection.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
const userStore = useUserStore()
onMounted(async () => {
  if (userStore.getIsLoggedIn) {
    await userStore.loadUserInfo()
  }
})
const tabs = [
  { label: '포인트', value: 'points', path: '/account/my-page/points' },
  { label: '내가 올린 매물', value: 'listings', path: '/account/my-page/listings' },
  { label: '내가 투자한 매물', value: 'investments', path: '/account/my-page/investments' },
  { label: '주문 내역', value: 'orderLists', path: '/account/my-page/orderLists' },
]

const router = useRouter()
const route = useRoute()
const currentTab = ref(getTabFromRoute(route.path))

function getTabFromRoute(path) {
  if (path.includes('points')) return 'points'
  if (path.includes('listings')) return 'listings'
  if (path.includes('investments')) return 'investments'
  if (path.includes('orderLists')) return 'orderLists'
  return 'points'
}

watch(
  () => route.path,
  (newPath) => {
    currentTab.value = getTabFromRoute(newPath)
  },
)

watch(currentTab, (value) => {
  const tab = tabs.find((t) => t.value === value)
  if (tab) router.push(tab.path)
})
</script>

<template>
  <BlankLayout>
    <DetailHeader>마이 페이지</DetailHeader>

    <div class="relative">
      <!-- 포인트 프로필 섹션을 헤더에 겹치도록 조정 -->
      <!-- <div class="absolute -top-24 left-0 w-full z-10"> -->
      <div class="bg-black rounded-2xl p-4 text-white mx-4 mt-4">
        <LoggedInPointSection>
          <BaseButton
            class="text-sm text-white border border-white !px-2 !py-1 rounded-md hover:bg-white hover:text-black transition"
            variant="secondary"
            @click="goToEditProfile"
          >
            정보 수정
          </BaseButton>
        </LoggedInPointSection>
        <!-- </div> -->
      </div>

      <!-- 하단 영역은 프로필 섹션의 높이만큼 패딩 추가 -->
      <div class="px-4 py-1 bg-white">
        <BaseTab :tabs="tabs" v-model="currentTab" class="mt-5" />
      </div>

      <!-- 하위 탭 컴포넌트 표시 -->
      <router-view />

      <!-- 항상 하단에 고정되는 로그아웃 섹션 -->
      <LogoutSection />
    </div>
  </BlankLayout>
</template>
