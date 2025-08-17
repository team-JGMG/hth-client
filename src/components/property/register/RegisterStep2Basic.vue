<template>
  <div class="w-full max-w-md mx-auto px-4 pb-8">
    <BaseTypography class="mb-6" size="xl" weight="bold">매물 정보를 입력해주세요.</BaseTypography>

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

    <div class="flex items-end gap-2">
      <div class="flex-1">
        <InputField
          v-model="store.propertyBasic.rawdCd"
          placeholder="시군구 코드"
          label="매물 주소 조회"
          readonly
        />
      </div>
      <BaseButton
        class="h-[38px] px-4 whitespace-nowrap bg-gray-600 hover:bg-gray-600 text-sm flex-shrink-0 mb-5"
        @click="toggleAddressSearch"
      >
        {{ show ? '닫기' : '주소 검색' }}
      </BaseButton>
    </div>

    <div v-show="show" class="relative w-full h-[430px] border mt-2 rounded overflow-hidden">
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

    <div class="mb-12 relative">
      <div class="flex items-center w-full gap-3">
        <div class="flex-1">
          <InputField
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
        {{ store.propertyBasic.price.trim() ? '* 숫자만 입력해주세요.' : '* 필수 항목입니다.' }}
      </BaseTypography>
    </div>

    <div class="mb-10 relative">
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
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { usePropertyRegisterStore } from '@/stores/propertyRegister'
import InputField from '@/components/auth/InputField.vue'
import BaseButton from '@/components/common/Button/BaseButton.vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'
import CompletedButton from '@/components/common/Button/CompletedButton.vue'

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

const closePostcode = () => {
  show.value = false
  const el = document.getElementById('daum-postcode')
  if (el) el.innerHTML = ''
}

const openPostcode = async () => {
  show.value = true
  await nextTick()

  const wrap = document.getElementById('daum-postcode')
  if (!wrap) return

  const pc = new window.daum.Postcode({
    oncomplete(data) {
      let fullAddr = data.address
      let extraAddr = ''
      if (data.addressType === 'R') {
        if (data.bname) extraAddr += data.bname
        if (data.buildingName) extraAddr += extraAddr ? ', ' + data.buildingName : data.buildingName
        if (extraAddr) fullAddr += ` (${extraAddr})`
      }
      store.propertyBasic.address = fullAddr
      store.propertyBasic.rawdCd = data.bcode?.slice(0, 5) || ''
      touched.value.address = true
      closePostcode()
    },
    width: '100%',
    height: '100%',
  })

  pc.embed(wrap)
}

const toggleAddressSearch = () => (show.value ? closePostcode() : openPostcode())

const onKeydown = (e) => {
  if (e.key === 'Escape' && show.value) {
    closePostcode()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const titleValid = computed(() => (store.propertyBasic.title ?? '').toString().trim() !== '')
const addressValid = computed(() => (store.propertyBasic.address ?? '').toString().trim() !== '')
const detailAddressValid = computed(
  () => (store.propertyBasic.detailAddress ?? '').toString().trim() !== '',
)

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

const handleNext = () => {
  Object.keys(touched.value).forEach((k) => (touched.value[k] = true))
  if (!isStepValid.value) return
  store.propertyBasic.size = normalizeDigits(sizeDigits.value)
  store.propertyBasic.price = normalizeDigits(priceDigits.value)
  store.propertyBasic.period = normalizeDigits(periodDigits.value)
  store.goToNextStep()
}
</script>
