<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="text-xl font-bold mb-6">매물 상세 정보를 입력해주세요.</BaseTypography>

    <!-- 매물 유형 -->
    <div class="mb-8 relative">
      <InputSelect
        v-model="store.propertyDetail.type"
        label="매물 유형"
        placeholder="매물 유형을 선택해주세요."
        :options="propertyTypes"
      />
      <BaseTypography
        v-if="submitTried && !store.propertyDetail.type"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 매물 유형을 선택해주세요.
      </BaseTypography>
    </div>

    <!-- 구조 -->
    <div class="mb-8 grid grid-cols-3 gap-2">
      <InputField v-model="store.propertyDetail.roomCount" placeholder="방 수" type="number" />
      <InputField
        v-model="store.propertyDetail.bathroomCount"
        placeholder="욕실 수"
        type="number"
      />
      <InputField v-model="store.propertyDetail.floor" placeholder="해당 층 수" type="number" />
    </div>

    <!-- 해시태그 선택 -->
    <div class="mb-8">
      <BaseTypography class="mb-2 text-sm font-medium">해시태그 선택</BaseTypography>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in hashtagOptions"
          :key="tag"
          @click="toggleTag(tag)"
          :class="[
            'px-3 py-1 rounded-full text-sm border',
            store.propertyDetail.options.includes(tag)
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-500 border-gray-300',
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 세부 정보 -->
    <div class="mb-8 relative">
      <BaseTypography class="mb-2 text-sm font-medium">세부 정보 입력</BaseTypography>
      <textarea
        v-model="store.propertyDetail.memo"
        class="w-full border rounded-lg p-3 text-sm resize-none h-32 focus:outline-none focus:ring focus:ring-black/30"
        placeholder="- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.      - 매물주변과 무관한 정보도 제한될 수 있습니다."
      />
    </div>

    <!-- 매물 사진 첨부 -->
    <div class="mb-12">
      <label class="text-sm font-medium block mb-2">매물 사진 첨부</label>
      <input type="file" class="hidden" id="fileInput" @change="handleFile" />
      <label
        for="fileInput"
        class="block w-full cursor-pointer py-2 border rounded px-4 text-gray-600"
      >
        {{ store.documents[0]?.name || '파일 선택' }}
      </label>
    </div>

    <!-- 다음 버튼 -->
    <BaseButton
      class="w-full py-3 rounded font-semibold"
      :class="isStepValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-400'"
      @click="handleNext"
    >
      다음
    </BaseButton>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import InputSelect from '@/components/common/Select/InputSelect.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'

const store = usePropertyRegisterStore()
const submitTried = ref(false)

const propertyTypes = ['아파트', '오피스텔', '상가', '토지', '주택']
const hashtagOptions = [
  '#신축',
  '#채광 좋음',
  '#오픈 확률 높음',
  '#역세권',
  '#대형 마트',
  '#개발 지역',
]

const toggleTag = (tag) => {
  const idx = store.propertyDetail.options.indexOf(tag)
  if (idx === -1) store.propertyDetail.options.push(tag)
  else store.propertyDetail.options.splice(idx, 1)
}

const handleFile = (e) => {
  const file = e.target.files[0]
  if (file) store.documents[0] = file
}

const isStepValid = computed(() => {
  const d = store.propertyDetail
  return d.type && d.roomCount && d.bathroomCount && d.floor
})

const handleNext = () => {
  submitTried.value = true
  if (isStepValid.value) {
    store.goToNextStep()
  }
}
</script>
