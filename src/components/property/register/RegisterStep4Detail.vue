<template>
  <div class="w-full max-w-md mx-auto px-4 pb-32">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      매물 상세 정보를 입력해주세요.
    </BaseTypography>

    <!-- 매물 유형 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">매물 유형</BaseTypography>
      <InputSelect
        v-model="store.propertyDetail.type"
        placeholder="매물 유형을 선택해주세요."
        :options="propertyTypes"
        @focus="touched.type = true"
      />
      <BaseTypography
        v-if="touched.type && !store.propertyDetail.type"
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        * 필수 항목입니다. 매물 유형을 선택해주세요.
      </BaseTypography>
    </div>

    <!-- 구조 -->
    <div class="mb-8 relative">
      <BaseTypography class="mb-2">해당 층 수</BaseTypography>
      <div class="flex items-center w-full gap-3">
        <span class="material-symbols-outlined -translate-y-2"> stairs </span>
        <div class="flex-1">
          <InputField
            v-model="store.propertyDetail.floor"
            type="number"
            @focus="touched.floor = true"
          />
        </div>
        <span class="text-base text-black -translate-y-2">층</span>
      </div>
      <BaseTypography
        v-if="touched.floor && getErrorMessage(store.propertyDetail.floor)"
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        {{ getErrorMessage(store.propertyDetail.floor) }}
      </BaseTypography>
    </div>

    <!-- 방 수 & 욕실 수 -->
    <div class="mb-10 relative">
      <div class="flex items-center w-full gap-4">
        <!-- 방 수 -->
        <div class="flex items-center gap-2 w-1/2">
          <span class="material-symbols-outlined -translate-y-2"> bedroom_child </span>
          <span class="text-base text-black whitespace-nowrap -translate-y-2">방 수</span>
          <InputField
            v-model="store.propertyDetail.roomCount"
            type="number"
            class="flex-1"
            placeholder="방 수"
            @focus="touched.roomCount = true"
          />
        </div>

        <!-- 욕실 수 -->
        <div class="flex items-center gap-2 w-1/2">
          <span class="material-symbols-outlined -translate-y-2"> bathroom </span>
          <span class="text-base text-black whitespace-nowrap -translate-y-2">욕실 수</span>
          <InputField
            v-model="store.propertyDetail.bathroomCount"
            type="number"
            class="flex-1"
            placeholder="욕실 수"
            @focus="touched.bathroomCount = true"
          />
        </div>
      </div>
      <BaseTypography
        v-if="
          (touched.roomCount && getErrorMessage(store.propertyDetail.roomCount)) ||
          (touched.bathroomCount && getErrorMessage(store.propertyDetail.bathroomCount))
        "
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        {{
          touched.roomCount && getErrorMessage(store.propertyDetail.roomCount)
            ? getErrorMessage(store.propertyDetail.roomCount)
            : getErrorMessage(store.propertyDetail.bathroomCount)
        }}
      </BaseTypography>
    </div>

    <!-- 해시태그 선택 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2" size="base" weight="medium">해시태그 선택</BaseTypography>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in hashtagOptions"
          :key="tag"
          @click="toggleTag(tag)"
          :disabled="
            store.propertyDetail.options.length >= 3 &&
            !store.propertyDetail.options.includes(hashtagOptions.indexOf(tag) + 1)
          "
          :class="[
            // 선택된 상태면 활성화
            'px-3 py-1 rounded-full text-sm border',
            store.propertyDetail.options.includes(hashtagOptions.indexOf(tag) + 1)
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-500 border-gray-300 disabled:opacity-40 ',
          ]"
        >
          {{ tag }}
        </button>
      </div>
      <BaseTypography
        v-if="touched.options && store.propertyDetail.options.length < 3"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{
          store.propertyDetail.options.length === 0 ? '* 필수 항목입니다.' : '* 3개를 선택해주세요.'
        }}
      </BaseTypography>
    </div>

    <!-- 세부 정보 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2" size="base" weight="medium">세부 정보 입력</BaseTypography>
      <textarea
        v-model="store.propertyDetail.memo"
        class="w-full border rounded-lg p-3 text-sm resize-none h-32 focus:outline-none focus:ring focus:ring-black/30"
        placeholder="- 매물 정보와 관련없는 홍보성 정보는 입력할 수 없습니다.      - 매물주변과 무관한 정보도 제한될 수 있습니다."
      />
    </div>

    <!-- 매물 사진 첨부 -->
    <div class="mb-12 relative">
      <label class="text-base font-medium block mb-2">매물 사진 첨부</label>

      <input type="file" class="hidden" id="fileInput" multiple @change="handleFiles" />

      <label
        for="fileInput"
        class="flex items-center justify-between w-full cursor-pointer border-b border-gray-400 py-2 text-base text-gray-700"
        @click="touched.image = true"
      >
        <!-- 파일명 또는 기본 텍스트 -->
        <span class="truncate">
          {{
            store.photoFiles.length > 0 ? `${store.photoFiles.length}개 파일 선택됨` : '파일 선택'
          }}
        </span>

        <!-- 클립 아이콘 -->
        <span class="material-symbols-outlined text-gray-500">attach_file</span>
      </label>

      <BaseTypography
        v-if="touched.image && !store.photoFiles[0]"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다. 매물 사진을 첨부해주세요.
      </BaseTypography>
    </div>

    <!-- 다음 버튼 -->
    <div class="pb-28">
      <CompletedButton
        :color="isStepValid ? 'black' : 'gray-300'"
        :text-color="isStepValid ? 'white' : 'gray-400'"
        :active-color="isStepValid ? 'gray-700' : 'gray-300'"
        :disabled="!isStepValid"
        class="w-full font-semibold py-3"
        @click="handleNext"
      >
        다음
      </CompletedButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import InputSelect from '@/components/common/Select/InputSelect.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'

const store = usePropertyRegisterStore()

const touched = ref({
  type: false,
  floor: false,
  roomCount: false,
  bathroomCount: false,
  options: false,
  image: false,
})

const propertyTypes = ['아파트']
const hashtagOptions = [
  '#교통호재',
  '#상권친화형',
  '#핫플레이스',
  '#하이테크',
  '#규제해제',
  '#산업허브',
  '#신축매물',
  '#공원인접',
  '#문화역사권',
  '#투자수익형',
]

const toggleTag = (tag) => {
  const id = hashtagOptions.indexOf(tag) + 1
  const options = store.propertyDetail.options
  const idx = options.indexOf(id)

  if (idx === -1) {
    if (options.length < 3) {
      options.push(id)
    }
  } else {
    options.splice(idx, 1)
  }

  touched.value.options = true
}

const handleFiles = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    store.photoFiles = Array.from(files)
  }
}

const isNumber = (value) => /^[0-9]+$/.test(value)

const getErrorMessage = (value) => {
  if (value === '') return '* 필수 항목입니다.'
  if (!isNumber(value)) return '* 숫자를 입력해주세요.'
  return ''
}

const isStepValid = computed(() => {
  const d = store.propertyDetail
  return (
    d.type &&
    d.floor !== '' &&
    isNumber(d.floor) &&
    d.roomCount !== '' &&
    isNumber(d.roomCount) &&
    d.bathroomCount !== '' &&
    isNumber(d.bathroomCount) &&
    d.options.length >= 3 &&
    !!store.photoFiles[0]
  )
})

const handleNext = () => {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true))
  if (isStepValid.value) {
    store.goToNextStep()
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>
