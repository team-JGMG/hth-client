<template>
  <div class="min-h-screen bg-black">
    <main class="max-w-md mx-auto min-h-screen bg-white text-white relative">
      <div class="p-5">테스트 헤더</div>
      <div class="p-5 flex-1">
        <slot></slot>
      </div>
      <div class="p-5">테스트 네비</div>
    </main>
  </div>
</template>

<script setup>
console.log('BaseLayout 로드됨')
</script>
