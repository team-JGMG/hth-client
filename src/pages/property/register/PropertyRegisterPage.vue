<template>
  <BlankLayout>
    <DetailHeader> 매물등록 </DetailHeader>
    <div>
      <component :is="currentStepComponent" />
    </div>
  </BlankLayout>
</template>

<script setup>
import { computed, onUnmounted } from 'vue'
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

onUnmounted(() => {
  store.resetStore()
})
</script>
