<template>
  <div
    class="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none"
    v-if="toast.items.length"
  >
    <div
      v-for="t in toast.items"
      :key="t.id"
      @click="toast.remove(t.id)"
      class="pointer-events-auto min-w-[240px] max-w-[90vw] rounded-[14px] px-5 py-3 text-center shadow-lg bg-white text-black animate-slideDown [animation-delay:0s,calc(var(--life,3)*1s-0.22s)] transition-opacity"
      :class="{
        'bg-[rgba(188,253,188,0.92)]': t.type === 'success',
        'bg-[rgba(253,197,197,0.92)]': t.type === 'error',
        'bg-[rgba(247,250,195,0.92)]': t.type === 'warn',
        'bg-[rgba(255,255,255,0.92)]': t.type === 'info',
      }"
    >
      <strong class="font-bold text-[15px]">{{ t.title }}</strong>
      <div class="opacity-90 mt-1 text-[13px] leading-tight">{{ t.body }}</div>
    </div>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>
