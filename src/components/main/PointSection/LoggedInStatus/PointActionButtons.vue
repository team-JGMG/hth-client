<template>
  <div class="flex space-x-3 mb-3">
    <button
      class="flex-1 bg-green-400 text-black py-2 rounded-xl font-medium"
      @click="$emit('charge')"
    >
      <span class="material-symbols-outlined text-2xl">add</span><br />
      <BaseTypography class="font-bold">포인트 충전</BaseTypography>
    </button>
    <button
      class="flex-1 bg-yellow-400 text-black py-2 rounded-xl font-medium"
      @click="$emit('refund')"
    >
      <span class="material-symbols-outlined text-2xl">remove</span><br />
      <BaseTypography class="font-bold">포인트 환급</BaseTypography>
    </button>
  </div>
</template>
