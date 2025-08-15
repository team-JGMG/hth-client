<template>
  <BlankLayout>
    <DetailHeader> 매물등록 </DetailHeader>
    <div ref="stepRoot">
      <component :is="currentStepComponent" :key="store.step" />
    </div>
  </BlankLayout>
</template>

<script setup>
import { computed, onUnmounted, watch, nextTick, ref } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'

import RegisterStep1Owner from '@/components/property/register/RegisterStep1Owner.vue'
import RegisterStep2Basic from '@/components/property/register/RegisterStep2Basic.vue'
import RegisterStep3Building from '@/components/property/register/RegisterStep3Building.vue'
import RegisterStep4Detail from '@/components/property/register/RegisterStep4Detail.vue'
import RegisterStep5Documents from '@/components/property/register/RegisterStep5Documents.vue'

import BlankLayout from '@/layouts/BlankLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'

const store = usePropertyRegisterStore()

const currentStepComponent = computed(() => {
  const map = {
    1: RegisterStep1Owner,
    2: RegisterStep2Basic,
    3: RegisterStep3Building,
    4: RegisterStep4Detail,
    5: RegisterStep5Documents,
  }
  return map[store.step]
})

const stepRoot = ref(null)

const scrollToTop = () => {
  let scroller = null
  if (stepRoot.value && typeof stepRoot.value.closest === 'function') {
    scroller = stepRoot.value.closest('[data-scroll-container]')
  }

  if (!scroller) {
    scroller = document.querySelector('[data-scroll-container]')
  }

  if (!scroller) {
    scroller = document.scrollingElement || document.documentElement || document.body || null
  }
  if (!scroller) return

  if (typeof scroller.scrollTo === 'function') {
    scroller.scrollTo({ top: 0, behavior: 'auto' })
  } else {
    scroller.scrollTop = 0
  }
}

watch(
  () => store.step,
  async () => {
    await nextTick()
    requestAnimationFrame(scrollToTop)
  },
)

onUnmounted(() => {
  store.resetStore()
})
</script>
