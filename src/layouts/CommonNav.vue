<template>
  <nav
    class="flex justify-around items-center bg-black py-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto"
  >
    <router-link
      to="/"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{ 'text-white': activeItem === 'home', 'text-gray-600': activeItem !== 'home' }"
    >
      <span
        class="material-symbols-outlined text-2xl"
        :class="{ 'material-symbols-fill': activeItem === 'home' }"
        >home</span
      >
      <span class="text-sm mt-1 font-semibold leading-tight">홈</span>
    </router-link>

    <router-link
      to="/funding/list"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{
        'text-white': activeItem === 'funding',
        'text-gray-600': activeItem !== 'funding',
        'is-disabled': !authStore.getIsLoggedIn, // 비활성화 클래스 추가
      }"
      @click.prevent="checkLoginAndNavigate('/funding/list')"
    >
      <span
        class="material-symbols-outlined text-2xl"
        :class="{ 'material-symbols-fill': activeItem === 'funding' }"
        >payments</span
      >
      <span class="text-sm mt-1 font-semibold leading-tight">펀딩</span>
    </router-link>

    <router-link
      to="/trade/list"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{
        'text-white': activeItem === 'trade',
        'text-gray-600': activeItem !== 'trade',
        'is-disabled': !authStore.getIsLoggedIn, // 비활성화 클래스 추가
      }"
      @click.prevent="checkLoginAndNavigate('/trade/list')"
    >
      <span
        class="material-symbols-outlined text-2xl"
        :class="{ 'material-symbols-fill': activeItem === 'trade' }"
        >monitoring</span
      >
      <span class="text-sm mt-1 font-semibold leading-tight">거래</span>
    </router-link>

    <router-link
      to="/account/my-page"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{
        'text-white': activeItem === 'my-page',
        'text-gray-600': activeItem !== 'my-page', // 오타 수정: 'myinfo' -> 'my-page'
        'is-disabled': !authStore.getIsLoggedIn, // 비활성화 클래스 추가
      }"
      @click.prevent="checkLoginAndNavigate('/account/my-page')"
    >
      <span
        class="material-symbols-outlined text-2xl"
        :class="{ 'material-symbols-fill': activeItem === 'my-page' }"
        >person</span
      >
      <span class="text-sm mt-1 font-semibold leading-tight">내정보</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router' // useRouter 임포트
import { useAuthStore } from '@/stores/authStore' // Pinia 스토어 임포트

const route = useRoute()
const router = useRouter() // useRouter 인스턴스 생성
const authStore = useAuthStore() // Pinia 스토어 인스턴스 생성

const activeItem = ref('home')

const updateActiveItemBasedOnRoute = () => {
  const currentPath = route.path
  if (currentPath === '/') {
    activeItem.value = 'home'
  } else if (currentPath.startsWith('/funding/list')) {
    activeItem.value = 'funding'
  } else if (currentPath.startsWith('/trade/list')) {
    activeItem.value = 'trade'
  } else if (currentPath.startsWith('/account/my-page')) {
    activeItem.value = 'my-page'
  }
}

const checkLoginAndNavigate = (targetPath) => {
  if (authStore.getIsLoggedIn) {
    router.push(targetPath)
  } else {
    router.push('auth/login')
  }
}

onMounted(() => {
  updateActiveItemBasedOnRoute()
})

watch(
  () => route.path,
  () => {
    updateActiveItemBasedOnRoute()
  },
)
</script>

<style scoped>
.material-symbols-fill {
  font-variation-settings: 'FILL' 1;
}

.is-disabled {
  pointer-events: none;
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
