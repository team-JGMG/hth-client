<template>
  <BlankLayout>
    <DetailHeader>마이 페이지</DetailHeader>

    <div class="bg-black rounded-2xl p-6 text-white mt-0">
      <LoggedInPointSection :showManageCard="false">
        <button class="w-fit" @click="goToEditProfile" aria-label="정보 수정">
          <span class="material-symbols-outlined"> person_edit </span>
        </button>
      </LoggedInPointSection>
    </div>

    <BaseTab :tabs="tabs" v-model="currentTab" class="mt-5" />
    <router-view />
    <LogoutSection />
  </BlankLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore as useUserStore } from '@/stores/authStore'
import { onMounted } from 'vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import BaseTab from '@/components/common/Tab/BaseTab.vue'
import LogoutSection from '@/components/account/LogoutSection.vue'
import LoggedInPointSection from '@/components/main/PointSection/LoggedInStatus/LoggedInPointSection.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'
const userStore = useUserStore()
onMounted(async () => {
  if (userStore.getIsLoggedIn?.value) {
    await userStore.loadUserInfo()
  }
  window.scrollTo({ top: 0, left: 0 })
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
