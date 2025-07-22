<script setup>
import UserProfileHeader from '@/components/account/UserProfileHeader.vue'

import DetailHeader from '@/layouts/DetailHeader.vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseTab from '@/components/common/Tab/BaseTab.vue'

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
  <DetailLayout>
    <DetailHeader>마이 페이지</DetailHeader>
    <div>
      <UserProfileHeader class="-mt-14" />
      <!-- 이메일, 보유포인트 등 -->
      <div class="px-4 py-2 bg-white">
        <BaseTab :tabs="tabs" v-model="currentTab" />
      </div>
      <!-- 상단 탭 버튼 -->
      <router-view />
      <!-- 하위 탭 컴포넌트 표시 -->
    </div>
  </DetailLayout>
</template>
