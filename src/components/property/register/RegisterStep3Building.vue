<template>
  <div class="w-full max-w-md mx-auto px-4 pb-8">
    <BaseTypography class="mb-6" size="xl" weight="bold">
      매물의 건축물 대장 정보를 입력해주세요.
    </BaseTypography>

    <!-- 용도 지역 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-1">용도 지역</BaseTypography>
      <InputSelect
        v-model="store.propertyBuilding.landUsageZone"
        placeholder="용도 지역을 선택해주세요."
        :options="landUsageZoneTypes"
        class="text-base"
        @focus="touched.landUsageZone = true"
      />
      <BaseTypography
        v-if="touched.landUsageZone && !isValid.landUsageZone"
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        * 필수 항목입니다. 용도 지역을 선택해주세요.
      </BaseTypography>
    </div>

    <!-- 대지 면적 -->
    <div class="mb-12">
      <BaseTypography class="mb-1">대지 면적</BaseTypography>
      <div class="relative">
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> house </span>
          <span class="text-base text-black -translate-y-2">매물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.landSize"
              placeholder="매물 면적을 입력해주세요."
              type="number"
              @focus="touched.landSize = true"
            />
          </div>
          <span class="text-base text-black -translate-y-2">㎡</span>
        </div>
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> apartment </span>
          <span class="text-base text-black -translate-y-2">건물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.buildingSize"
              placeholder="건물 면적을 입력해주세요."
              type="number"
              @focus="touched.buildingSize = true"
            />
          </div>
          <span class="text-base text-black -translate-y-2">㎡</span>
        </div>
        <!-- 에러 메시지 -->
        <BaseTypography
          v-if="
            (touched.landSize && getErrorMessage(store.propertyBuilding.landSize)) ||
            (touched.buildingSize && getErrorMessage(store.propertyBuilding.buildingSize))
          "
          color="red-1"
          size="xs"
          class="absolute left-0 top-full"
        >
          {{
            touched.landSize && getErrorMessage(store.propertyBuilding.landSize)
              ? getErrorMessage(store.propertyBuilding.landSize)
              : getErrorMessage(store.propertyBuilding.buildingSize)
          }}
        </BaseTypography>
      </div>
    </div>

    <!-- 연면적 -->
    <div class="mb-12">
      <BaseTypography class="mb-1">연면적</BaseTypography>
      <div class="relative">
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> house </span>
          <span class="text-base text-black -translate-y-2">매물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.landTotalArea"
              placeholder="매물 면적을 입력해주세요."
              type="number"
              @focus="touched.landTotalArea = true"
            />
          </div>
          <span class="text-base text-black -translate-y-2">㎡</span>
        </div>
        <div class="flex items-center w-full gap-3">
          <span class="material-symbols-outlined -translate-y-2"> apartment </span>
          <span class="text-base text-black -translate-y-2">건물</span>
          <div class="flex-1">
            <InputField
              v-model="store.propertyBuilding.buildingTotalArea"
              placeholder="건물 면적을 입력해주세요."
              type="number"
              @focus="touched.buildingTotalArea = true"
            />
          </div>
          <span class="text-base text-black -translate-y-2">㎡</span>
        </div>
        <!-- 에러 메시지 -->
        <BaseTypography
          v-if="
            (touched.landTotalArea && getErrorMessage(store.propertyBuilding.landTotalArea)) ||
            (touched.buildingTotalArea && getErrorMessage(store.propertyBuilding.buildingTotalArea))
          "
          color="red-1"
          size="xs"
          class="absolute left-0 top-full"
        >
          {{
            touched.landTotalArea && getErrorMessage(store.propertyBuilding.landTotalArea)
              ? getErrorMessage(store.propertyBuilding.landTotalArea)
              : getErrorMessage(store.propertyBuilding.buildingTotalArea)
          }}
        </BaseTypography>
      </div>
    </div>

    <!-- 건물 규모 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">건물 규모</BaseTypography>
      <div class="flex items-center gap-1">
        <span class="material-symbols-outlined -translate-y-2"> arrow_circle_down </span>
        <InputField
          v-model="store.propertyBuilding.floorUnder"
          icon="unfold_less"
          placeholder="지하 층 수"
          type="number"
          @focus="touched.floorUnder = true"
        />
        <span class="text-base text-black -translate-y-2 mr-4">층</span>
        <span class="material-symbols-outlined -translate-y-2"> arrow_circle_up </span>
        <InputField
          v-model="store.propertyBuilding.floorAbove"
          icon="unfold_more"
          placeholder="지상 층 수"
          type="number"
          @focus="touched.floorAbove = true"
        />
        <span class="text-base text-black -translate-y-2">층</span>
      </div>
      <!-- 에러 메시지 -->
      <BaseTypography
        v-if="
          (touched.floorUnder && getErrorMessage(store.propertyBuilding.floorUnder)) ||
          (touched.floorAbove && getErrorMessage(store.propertyBuilding.floorAbove))
        "
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        {{
          touched.floorUnder && getErrorMessage(store.propertyBuilding.floorUnder)
            ? getErrorMessage(store.propertyBuilding.floorUnder)
            : getErrorMessage(store.propertyBuilding.floorAbove)
        }}
      </BaseTypography>
    </div>

    <!-- 준공일 (달력 입력) -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">준공일</BaseTypography>

      <div class="relative">
        <input
          type="text"
          class="w-full border-b border-gray-300 py-2 pr-10 text-base text-gray-600 focus:outline-none"
          placeholder="날짜를 선택해주세요."
          :value="formattedBuiltDate"
          @focus="onBuiltDateFocus"
          readonly
        />
        <!-- 달력 아이콘 -->
        <span
          class="material-symbols-outlined absolute right-2 top-2 text-gray-400 cursor-pointer"
          @click="onBuiltDateFocus"
        >
          calendar_month
        </span>
      </div>

      <!-- 달력 컴포넌트 -->
      <div v-if="isDatePickerOpen" class="absolute z-50 mt-2 shadow-lg bg-white border rounded">
        <VDatePicker
          v-model="store.propertyBuilding.builtDate"
          is-inline
          @update:modelValue="handleDateSelect"
        />
      </div>

      <BaseTypography
        v-if="touched.builtDate && !isValid.builtDate"
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 공시지가 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">공시지가</BaseTypography>
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBuilding.officialPrice"
            placeholder="금액을 입력해주세요."
            type="number"
            @focus="touched.officialPrice = true"
          />
        </div>
        <span class="text-base text-black -translate-y-1 relative">원/㎡</span>
      </div>
      <!-- 에러 메시지 -->
      <BaseTypography
        v-if="touched.officialPrice && getErrorMessage(store.propertyBuilding.officialPrice)"
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        {{ getErrorMessage(store.propertyBuilding.officialPrice) }}
      </BaseTypography>
    </div>

    <!-- 연면적 평단가 -->
    <div class="mb-12 relative">
      <BaseTypography class="mb-2">연면적 평단가 (평/공모금액 기준)</BaseTypography>
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBuilding.marketPrice"
            placeholder="금액을 입력해주세요."
            type="number"
            @focus="touched.marketPrice = true"
          />
        </div>
        <span class="text-base text-black -translate-y-2">원</span>
      </div>
      <!-- 에러 메시지 -->
      <BaseTypography
        v-if="touched.marketPrice && getErrorMessage(store.propertyBuilding.marketPrice)"
        color="red-1"
        size="xs"
        class="absolute left-0 top-full"
      >
        {{ getErrorMessage(store.propertyBuilding.marketPrice) }}
      </BaseTypography>
    </div>

    <!-- 🔽 매물 사진 첨부 (최대 3장) -->
    <div class="mb-28">
      <label class="text-base font-medium block mb-2">매물 사진 첨부 (최대 3장)</label>

      <input
        id="fileInputBuilding"
        type="file"
        class="hidden"
        multiple
        accept="image/*"
        @change="handleFiles"
      />

      <label
        for="fileInputBuilding"
        class="flex items-center justify-between w-full border-b border-gray-400 py-2 text-base text-gray-700"
        :class="
          store.photoFiles.length >= 3
            ? 'cursor-not-allowed opacity-60 pointer-events-none'
            : 'cursor-pointer'
        "
        @click="touched.image = true"
      >
        <!-- 파일명 라벨 -->
        <span class="truncate" :title="fileTitle">
          {{ fileLabel }}
        </span>
        <span class="material-symbols-outlined text-gray-500">attach_file</span>
      </label>

      <!-- 선택된 파일 목록 뱃지 -->
      <div v-if="store.photoFiles.length" class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="(f, i) in store.photoFiles"
          :key="i"
          class="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-gray-300 text-xs text-gray-700 bg-white"
        >
          <span class="material-symbols-outlined text-[14px]">image</span>
          <span class="truncate max-w-[180px]">{{ f.name }}</span>
          <button
            type="button"
            class="ml-1 text-gray-400 hover:text-gray-600"
            @click="removeFile(i)"
            aria-label="파일 삭제"
            title="삭제"
          >
            ×
          </button>
        </span>
      </div>

      <!-- 안내/에러 -->
      <BaseTypography color="red-1" size="xs" class="mt-2">
        * 최대 3장까지 첨부할 수 있습니다. ({{ store.photoFiles.length }}/3)
      </BaseTypography>
      <BaseTypography v-if="fileError" color="red-1" size="xs" class="mt-1">
        {{ fileError }}
      </BaseTypography>
    </div>

    <!-- 다음 버튼 -->
    <div class="pb-12">
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
import { format } from 'date-fns'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import InputSelect from '@/components/common/Select/InputSelect.vue'

const store = usePropertyRegisterStore()
const isDatePickerOpen = ref(false)
const fileError = ref('')

const formattedBuiltDate = computed(() => {
  const raw = store.propertyBuilding.builtDate
  if (!raw) return ''
  return format(new Date(raw), 'yyyy-MM-dd')
})

const onBuiltDateFocus = () => {
  isDatePickerOpen.value = true
  touched.value.builtDate = true
}

const handleDateSelect = () => {
  isDatePickerOpen.value = false
}

const touched = ref({
  landUsageZone: false,
  landSize: false,
  buildingSize: false,
  landTotalArea: false,
  buildingTotalArea: false,
  floorUnder: false,
  floorAbove: false,
  builtDate: false,
  officialPrice: false,
  marketPrice: false,
  image: false,
})

const landUsageZoneTypes = ['주거지역', '상업지역', '기타']

const isNumber = (value) => /^[0-9]+$/.test(value)

const isValid = computed(() => {
  const b = store.propertyBuilding
  return {
    landUsageZone: !!b.landUsageZone,
    landSize: b.landSize !== '' && isNumber(b.landSize),
    buildingSize: b.buildingSize !== '' && isNumber(b.buildingSize),
    landTotalArea: b.landTotalArea !== '' && isNumber(b.landTotalArea),
    buildingTotalArea: b.buildingTotalArea !== '' && isNumber(b.buildingTotalArea),
    floorUnder: b.floorUnder !== '' && isNumber(b.floorUnder),
    floorAbove: b.floorAbove !== '' && isNumber(b.floorAbove),
    builtDate: !!b.builtDate,
    officialPrice: b.officialPrice !== '' && isNumber(b.officialPrice),
    marketPrice: b.marketPrice !== '' && isNumber(b.marketPrice),
  }
})

const getErrorMessage = (value) => {
  if (value === '') return '* 필수 항목입니다.'
  if (!isNumber(value)) return '* 숫자를 입력해주세요.'
  return ''
}

const isStepValid = computed(() => {
  // 사진은 '최대 3개' 제한만 있고 필수는 아님
  return Object.values(isValid.value).every(Boolean)
})

// ---------- 파일 업로드(최대 3장) ----------
const fileLabel = computed(() => {
  const len = store.photoFiles?.length || 0
  if (len === 0) return '파일 선택'
  if (len === 1) return store.photoFiles[0].name
  return `${store.photoFiles[0].name} 외 ${len - 1}개`
})

const fileTitle = computed(() => (store.photoFiles || []).map((f) => f.name).join(', '))

const handleFiles = (e) => {
  fileError.value = ''
  const selected = Array.from(e.target.files || [])
  if (!selected.length) {
    e.target.value = ''
    return
  }

  // 남은 슬롯 계산
  const current = store.photoFiles || []
  const available = Math.max(0, 3 - current.length)

  // 최대 3장까지만 추가
  const toAdd = selected.slice(0, available)
  const excess = selected.length - toAdd.length

  store.photoFiles = [...current, ...toAdd]

  if (excess > 0) {
    fileError.value = `초과된 ${excess}개 파일은 제외됐습니다.`
  }

  // 같은 파일 다시 선택 가능하도록 리셋
  e.target.value = ''
}

const removeFile = (idx) => {
  if (!Array.isArray(store.photoFiles)) return
  store.photoFiles.splice(idx, 1)
  fileError.value = ''
}

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
