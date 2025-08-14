<template>
  <div class="w-full max-w-md mx-auto px-4 pb-8">
    <BaseTypography class="mb-6" size="xl" weight="bold">매물 정보를 입력해주세요.</BaseTypography>

    <!-- 매물명 -->
    <div class="mb-12 relative">
      <InputField
        v-model="store.propertyBasic.title"
        label="매물명"
        placeholder="매물명을 입력해주세요."
        @focus="touched.title = true"
      />
      <BaseTypography
        v-if="touched.title && !titleValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        * 필수 항목입니다.
      </BaseTypography>
    </div>

    <!-- 주소 -->
    <!-- 매물 주소 조회 -->
    <Basetypography size="sm" weight="bold" class="block mb-1">매물 주소 조회</Basetypography>

    <!-- 입력창 + 버튼 한 줄 -->
    <div class="flex items-center gap-2">
      <InputField
        v-model="store.propertyBasic.rawdCd"
        placeholder="시군구 코드"
        class="flex-1"
        readonly
      />
      <BaseButton
        class="h-[38px] px-4 whitespace-nowrap bg-gray-600 hover:bg-gray-600 text-sm -translate-y-[8px]"
        @click="searchAddress"
      >
        주소 검색
      </BaseButton>
    </div>
    <div v-show="show" class="relative w-full h-[400px] border mt-2 rounded overflow-hidden">
      <div id="daum-postcode" class="absolute top-0 left-0 w-full h-full"></div>
    </div>
    <InputField
      v-model="store.propertyBasic.address"
      placeholder="주소를 입력해주세요."
      class="mt-1 mb-2"
      readonly
      @focus="touched.address = true"
    />
    <InputField
      v-model="store.propertyBasic.detailAddress"
      placeholder="상세주소를 입력해주세요."
      class="mt-1"
      @focus="touched.detailAddress = true"
    />
    <BaseTypography
      v-if="(touched.address || touched.detailAddress) && (!addressValid || !detailAddressValid)"
      color="red-1"
      size="xs"
      class="absolute mt-1 left-0 top-full"
    >
      * 주소 및 상세주소를 입력해주세요.
    </BaseTypography>
    <!-- 매물 크기 -->
    <div class="mb-12 relative mt-12">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBasic.size"
            label="매물 크기"
            placeholder="면적을 입력해주세요."
            @focus="touched.size = true"
          />
        </div>
        <span class="text-base text-black translate-y-2">㎡</span>
      </div>
      <BaseTypography
        v-if="touched.size && !sizeValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ store.propertyBasic.size.trim() ? '* 숫자만 입력해주세요.' : '* 필수 항목입니다.' }}
      </BaseTypography>
    </div>

    <!-- 희망 매매가 -->
    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <CurrencyInput
            v-model="store.propertyBasic.price"
            label="희망 매매가"
            placeholder="금액을 입력해주세요."
            @focus="touched.price = true"
          />
        </div>
        <span class="text-base text-black translate-y-2">원</span>
      </div>
      <BaseTypography
        v-if="touched.price && !priceValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{
          (store.propertyBasic.price ?? '').toString().trim()
            ? '* 숫자만 입력해주세요.'
            : '* 필수 항목입니다.'
        }}
      </BaseTypography>
    </div>

    <!-- 공고 기간 -->
    <div class="mb-28 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
            v-model="store.propertyBasic.period"
            label="희망 공고 기간"
            placeholder="개월 수를 숫자로 입력해주세요."
            @focus="touched.period = true"
          />
        </div>
        <span class="text-base text-black translate-y-1">개월</span>
      </div>
      <BaseTypography
        v-if="touched.period && !periodValid"
        color="red-1"
        size="xs"
        class="absolute mt-1 left-0 top-full"
      >
        {{ store.propertyBasic.period.trim() ? '* 숫자만 입력해주세요.' : '* 필수 항목입니다.' }}
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
import { ref, computed } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'
import CurrencyInput from '@/components/auth/CurrencyInput.vue'

const store = usePropertyRegisterStore()

const toDigits = (v) => (v ?? '').toString().replace(/[^\d]/g, '')
const normalizeDigits = (s) => {
  if (s === '') return ''
  const n = s.replace(/^0+/, '')
  return n === '' ? '0' : n
}

const touched = ref({
  title: false,
  address: false,
  detailAddress: false,
  size: false,
  price: false,
  period: false,
})

const show = ref(false)

const searchAddress = () => {
  show.value = true
  setTimeout(() => {
    new daum.Postcode({
      oncomplete: function (data) {
        let fullAddr = data.address
        let extraAddr = ''

        if (data.addressType === 'R') {
          if (data.bname !== '') extraAddr += data.bname
          if (data.buildingName !== '') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
          }
          fullAddr += extraAddr !== '' ? ' (' + extraAddr + ')' : ''
        }

        store.propertyBasic.address = fullAddr
        store.propertyBasic.rawdCd = data.bcode?.slice(0, 5) || ''
        touched.value.address = true
        show.value = false
      },
      width: '100%',
      height: '100%',
    }).embed(document.getElementById('daum-postcode'))
  })
}

// ===== 유효성 검사 (안전하게 문자열 변환 후 숫자만 검사) =====
const titleValid = computed(() => (store.propertyBasic.title ?? '').toString().trim() !== '')
const addressValid = computed(() => (store.propertyBasic.address ?? '').toString().trim() !== '')
const detailAddressValid = computed(
  () => (store.propertyBasic.detailAddress ?? '').toString().trim() !== '',
)

// 숫자 필드는 콤마/공백/문자 제거 후 검사
const sizeDigits = computed(() => toDigits(store.propertyBasic.size))
const priceDigits = computed(() => toDigits(store.propertyBasic.price))
const periodDigits = computed(() => toDigits(store.propertyBasic.period))

const sizeValid = computed(() => sizeDigits.value !== '')
const priceValid = computed(() => priceDigits.value !== '')
const periodValid = computed(() => periodDigits.value !== '')

const isStepValid = computed(
  () =>
    titleValid.value &&
    addressValid.value &&
    detailAddressValid.value &&
    sizeValid.value &&
    priceValid.value &&
    periodValid.value,
)

// ===== 다음 단계 처리 =====
const handleNext = () => {
  Object.keys(touched.value).forEach((key) => (touched.value[key] = true))
  if (!isStepValid.value) return

  // 서버 전송 전에 숫자만 남겨 정규화 (선행 0 처리 포함)
  store.propertyBasic.size = normalizeDigits(sizeDigits.value)
  store.propertyBasic.price = normalizeDigits(priceDigits.value)
  store.propertyBasic.period = normalizeDigits(periodDigits.value)

  // 필요 시 숫자형으로 변환해서 사용 예:
  // const payload = {
  //   ...store.propertyBasic,
  //   price: Number(store.propertyBasic.price),
  //   size: Number(store.propertyBasic.size),
  //   period: Number(store.propertyBasic.period),
  // }

  store.goToNextStep()
}
</script>
