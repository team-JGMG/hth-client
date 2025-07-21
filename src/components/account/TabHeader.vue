<template>
  <div class="tab-container">
    <div class="tab-wrapper">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-button', { active: tab.value === currentTab }]"
        @click="selectTab(tab.value)"
      >
        <BaseTypography class="text-sm font-medium">
          {{ tab.label }}
        </BaseTypography>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const tabs = [
  { label: '포인트', value: 'points', path: '/account/my-page/points' },
  { label: '내가 올린 매물', value: 'listings', path: '/account/my-page/listings' },
  { label: '내가 투자한 매물', value: 'investments', path: '/account/my-page/investments' },
]

const route = useRoute()
const router = useRouter()
const currentTab = ref(getTabFromRoute(route.path))

function getTabFromRoute(path) {
  if (path.includes('points')) return 'points'
  if (path.includes('listings')) return 'listings'
  if (path.includes('investments')) return 'investments'
  return 'points'
}

watch(
  () => route.path,
  (newPath) => {
    currentTab.value = getTabFromRoute(newPath)
  },
)

const selectTab = (value) => {
  const tab = tabs.find((t) => t.value === value)
  if (tab) {
    router.push(tab.path)
  }
}
</script>

<style scoped>
.tab-container {
  padding: 16px;
  background-color: #fff;
}
.tab-wrapper {
  display: flex;
  background-color: #f3f3f3;
  padding: 4px;
  border-radius: 9999px;
}
.tab-button {
  flex: 1;
  padding: 6px 10px;
  border-radius: 9999px;
  text-align: center;
  font-weight: 500;
  color: #666;
  background-color: transparent;
  transition: all 0.2s ease;
}
.tab-button.active {
  background-color: #fff;
  color: #000;
}
</style>
