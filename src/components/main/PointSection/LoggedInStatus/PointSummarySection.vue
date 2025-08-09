<template>
  <div>
    <BaseTypography class="text-xl mb-1" color="white"> {{ userName }}님, </BaseTypography>
    <div class="mb-4 flex items-baseline justify-between">
      <BaseTypography class="text-xl font-medium" color="white">보유 포인트</BaseTypography>
      <BaseTypography class="text-xl font-medium" color="white">
        {{ (point).toLocaleString() }}원
      </BaseTypography>
    </div>
  </div>
</template>

<script setup>
defineProps({
  userName: String,
  point: Number,
})
</script>
