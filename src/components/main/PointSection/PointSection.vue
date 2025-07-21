<template>
  <div class="mb-4">
    <div class="bg-black rounded-2xl p-6 text-white">
      <template v-if="userStore.authToken">
        <LoggedInPointSection />
      </template>
      <template v-else>
        <LoggedOutPointSection />
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import LoggedInPointSection from './LoggedInPointSection.vue'
import LoggedOutPointSection from './LoggedOutPointSection.vue'

const userStore = useUserStore()

const fetchUserDataAndPoints = async () => {
  try {
    const authToken = userStore.authToken

    if (!authToken) {
      userStore.clearUserData()
      console.warn('인증 토큰이 없습니다. 로그인 상태가 아닙니다.')
      return
    }

    const response = await fetch('/points/history/1', {
      // 실제 userId 경로로 변경
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        console.error('인증 실패: 유효하지 않은 토큰입니다. 다시 로그인해야 합니다.')
        userStore.clearUserData()
      } else {
        throw new Error(`HTTP 에러! 상태: ${response.status}`)
      }
      return
    }

    const data = await response.json()
    const fetchedUserName = data.user_name || data.username || ''
    const fetchedPoints = data.current_balance || data.total_points || 0

    userStore.setUserName(fetchedUserName)
    userStore.setUserPoints(fetchedPoints)
  } catch (error) {
    console.error('사용자 데이터 및 포인트를 가져오지 못했습니다:', error)
    userStore.clearUserData()
  }
}

onMounted(() => {
  fetchUserDataAndPoints()
})
</script>
