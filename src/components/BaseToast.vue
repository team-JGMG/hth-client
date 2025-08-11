<template>
  <div class="toast-wrap" v-if="toast.items.length">
    <div
      v-for="t in toast.items"
      :key="t.id"
      class="toast"
      :class="t.type"
      @click="toast.remove(t.id)"
    >
      <strong class="title">{{ t.title }}</strong>
      <div class="body">{{ t.body }}</div>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none; /* 겹침 방지 */
}
.toast {
  pointer-events: auto; /* 클릭 제거 가능 */
  min-width: 240px;
  max-width: 90vw;
  background: #fff;
  color: #000;
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  text-align: center;
  animation:
    toastPop 0.25s ease-out,
    toastFade 0.25s ease-in forwards;
  animation-delay: 0s, calc(var(--life, 3) * 1s - 0.25s);
}
.toast .title {
  font-weight: 700;
  font-size: 15px;
}
.toast .body {
  opacity: 0.9;
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.35;
}

/* 타입별 색감 라이트닝(원하면 조정) */
.toast.success {
  background: rgba(215, 255, 215, 0.92);
}
.toast.error {
  background: rgba(250, 209, 209, 0.92);
}
.toast.warn {
  background: rgba(249, 251, 216, 0.92);
}
.toast.info {
  background: rgba(255, 255, 255, 0.92);
}

@keyframes toastPop {
  from {
    transform: translate(-50%, -46%) scale(0.98);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}
@keyframes toastFade {
  to {
    opacity: 0;
    transform: translate(-50%, -54%) scale(0.98);
  }
}
</style>
