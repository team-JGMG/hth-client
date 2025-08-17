<template>
  <div class="skeleton-ui">
    <div class="skeleton-item point-section"></div>
    <div class="flex space-x-3">
      <div class="skeleton-item funding-section flex-1"></div>
      <div class="skeleton-item trade-section flex-1"></div>
    </div>
    <div class="skeleton-item property-section"></div>
  </div>
</template>

<style scoped>
.skeleton-ui {
  width: 100%;
  height: 100%;
}

.skeleton-item {
  background-color: #e0e0e0;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
}

.skeleton-item::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.2) 20%,
    rgba(255, 255, 255, 0.5) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.point-section {
  height: 150px;
}

.funding-section,
.trade-section {
  height: 200px;
}

.property-section {
  height: 250px;
}
</style>
