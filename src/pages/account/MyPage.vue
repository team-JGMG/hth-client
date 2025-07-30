<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

import UserProfileHeader from '@/components/account/UserProfileHeader.vue'
import UserProfileSection from '@/components/account/UserProfileSection.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import LogoutSection from '@/components/account/LogoutSection.vue'

const tabs = [
  { label: '포인트', value: 'points', path: '/account/my-page/points' },
  { label: '내가 올린 매물', value: 'listings', path: '/account/my-page/listings' },
  { label: '내가 투자한 매물', value: 'investments', path: '/account/my-page/investments' },
  { label: '주문 내역', value: 'orderLists', path: '/account/my-page/orderLists' },
]

const router = useRouter()
const route = useRoute()
const currentTab = ref(getTabFromRoute(route.path))

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.userName)
const profileComponent = computed(() => (isLoggedIn.value ? UserProfileSection : UserProfileHeader))
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
  <DetailLayout>
    <DetailHeader>마이 페이지</DetailHeader>
    <div>
      <!-- 정보 수정 및 보유포인트 등 -->
      <div class="px-4 py-2 bg-white -mt-8">
        <component :is="profileComponent" class="-mt-14" />
        <BaseTab :tabs="tabs" v-model="currentTab" class="mt-5" />
      </div>

      <!-- 하위 탭 컴포넌트 표시 -->
      <router-view />

      <!-- 항상 하단에 고정되는 버튼 섹션 -->
      <LogoutSection />
    </div>
  </DetailLayout>
</template>
