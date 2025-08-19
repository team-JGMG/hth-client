<template>
  <div class="w-full h-full rounded-lg overflow-hidden relative">
    <div class="absolute inset-0 bg-gray-200"></div>
    <div class="absolute inset-0 shimmer"></div>
  </div>
</template>

<style scoped>
.shimmer {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.25) 20%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.8s infinite;
  transform: translateX(-100%);
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
