<!-- myPage.vue -->
<template>
  <BlankLayout>
    <DetailHeader>마이 페이지</DetailHeader>

    <!-- 포인트 프로필 섹션을 헤더에 겹치도록 조정 -->
    <div class="bg-black rounded-2xl p-4 text-white mt-4">
      <LoggedInPointSection :showManagingButton="false">
        <CompletedButton
          :color="'[#374151]'"
          :activeColor="'[#4b5563]'"
          :textColor="'white'"
          class="w-fit px-2 py-1"
          @click="goToEditProfile"
        >
          정보 수정
        </CompletedButton>
      </LoggedInPointSection>
    </div>

    <!-- 하단 영역은 프로필 섹션의 높이만큼 패딩 추가 -->
    <BaseTab :tabs="tabs" v-model="currentTab" class="mt-5" />

    <!-- 하위 탭 컴포넌트 표시 -->
    <router-view />

    <!-- 항상 하단에 고정되는 로그아웃 섹션 -->
    <LogoutSection />
  </BlankLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import LogoutSection from '@/components/account/LogoutSection.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import LoggedInPointSection from '@/components/main/PointSection/LoggedInPointSection.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
const userStore = useUserStore()
onMounted(async () => {
  if (userStore.getIsLoggedIn) {
    await userStore.loadUserInfo()
  }
})
const tabs = [
  { label: '포인트', value: 'points', path: '/account/my-page/points' },
  { label: '내 매물', value: 'listings', path: '/account/my-page/listings' },
  { label: '투자 매물', value: 'investments', path: '/account/my-page/investments' },
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
