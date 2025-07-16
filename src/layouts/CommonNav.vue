<template>
  <nav
    class="flex justify-around items-center h-20 bg-black px-8 py-3 fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-gray-800 shadow-lg"
  >
    <a
      href="#"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{ 'text-white': activeItem === 'home', 'text-gray-600': activeItem !== 'home' }"
      @click="setActive('home')"
    >
      <span
        class="material-symbols-outlined text-3xl"
        :class="{ 'material-symbols-fill': activeItem === 'home' }"
        >home</span
      >
      <span class="text-xs mt-1 font-medium">홈</span>
    </a>

    <a
      href="#"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{ 'text-white': activeItem === 'funding', 'text-gray-600': activeItem !== 'funding' }"
      @click="setActive('funding')"
    >
      <span
        class="material-symbols-outlined text-3xl"
        :class="{ 'material-symbols-fill': activeItem === 'funding' }"
        >payments</span
      >
      <span class="text-xs mt-1 font-medium">펀딩</span>
    </a>

    <a
      href="#"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{ 'text-white': activeItem === 'trade', 'text-gray-600': activeItem !== 'trade' }"
      @click="setActive('trade')"
    >
      <span
        class="material-symbols-outlined text-3xl"
        :class="{ 'material-symbols-fill': activeItem === 'trade' }"
        >trending_up</span
      >
      <span class="text-xs mt-1 font-medium">거래</span>
    </a>

    <a
      href="#"
      class="flex flex-col items-center hover:text-white px-2"
      :class="{ 'text-white': activeItem === 'myinfo', 'text-gray-600': activeItem !== 'myinfo' }"
      @click="setActive('myinfo')"
    >
      <span
        class="material-symbols-outlined text-3xl"
        :class="{ 'material-symbols-fill': activeItem === 'myinfo' }"
        >person</span
      >
      <span class="text-xs mt-1 font-medium">내정보</span>
    </a>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const activeItem = ref('home')

const setActive = (item) => {
  activeItem.value = item
}
</script>

<style scoped>
.material-symbols-fill {
  font-variation-settings: 'FILL' 1;
}
</style>
