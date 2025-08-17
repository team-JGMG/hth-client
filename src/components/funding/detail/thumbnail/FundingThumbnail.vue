<template>
  <div class="relative w-full h-[250px] overflow-hidden">
    <transition-group :name="slideDirection" tag="div" class="relative w-full h-full">
      <img
        v-for="(img, index) in images"
        v-show="index === currentImageIndex"
        :key="index"
        :src="img.photoUrl"
        class="absolute top-0 left-0 w-full h-full object-contain"
        alt="매물 이미지"
      />
    </transition-group>

    <div
      class="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-10 select-none touch-manipulation"
      @click="prevImage"
    ></div>
    <div
      class="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-10 select-none touch-manipulation"
      @click="nextImage"
    ></div>

    <div class="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-20">
      <StepIndicator :current-step="currentImageIndex + 1" :total-steps="images.length" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import StepIndicator from '@/components/onboarding/StepIndicator.vue'

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
})

const currentImageIndex = ref(0)
const slideDirection = ref('slide-right')

let interval = null

function startAutoSlide() {
  interval = setInterval(() => {
    slideDirection.value = 'slide-right'
    currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
  }, 3000)
}

function stopAutoSlide() {
  if (interval) clearInterval(interval)
}

function restartAutoSlide() {
  stopAutoSlide()
  startAutoSlide()
}

function prevImage() {
  slideDirection.value = 'slide-left'
  currentImageIndex.value =
    (currentImageIndex.value - 1 + props.images.length) % props.images.length
  restartAutoSlide()
}

function nextImage() {
  slideDirection.value = 'slide-right'
  currentImageIndex.value = (currentImageIndex.value + 1) % props.images.length
  restartAutoSlide()
}

onMounted(() => {
  startAutoSlide()
})

onBeforeUnmount(() => {
  stopAutoSlide()
})
</script>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.4s ease-in-out;
}

.slide-right-enter-from {
  transform: translateX(100%);
}

.slide-right-leave-to {
  transform: translateX(-100%);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.4s ease-in-out;
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(100%);
}

div {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
