<template>
  <img
    src="@/assets/images/character/loading.png"
    alt="로딩"
    class="w-12 h-12 animate-spin opacity-70"
  />
</template>

<style scoped>
.animate-spin {
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
