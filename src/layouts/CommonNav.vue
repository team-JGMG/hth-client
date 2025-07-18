<template>
  <nav
    class="flex justify-around items-center bg-black py-2 fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t-2 border-gray-400 shadow-lg"
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
      :class="{ 'text-white': activeItem === 'funding', 'text-gray-600': activeItem !== 'funding' }"
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
      :class="{ 'text-white': activeItem === 'trade', 'text-gray-600': activeItem !== 'trade' }"
    >
      <span
        class="material-symbols-outlined text-2xl"
        :class="{ 'material-symbols-fill': activeItem === 'trade' }"
        >trending_up</span
      >
      <span class="text-sm mt-1 font-semibold leading-tight">거래</span>
    </router-link>

    <router-link
      to="/account/my-page"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{ 'text-white': activeItem === 'my-page', 'text-gray-600': activeItem !== 'myinfo' }"
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
import { useRoute } from 'vue-router'

const route = useRoute()
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
</style>
