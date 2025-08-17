<template>
  <section class="mt-4 px-2 bg-white">
    <BaseTypography class="mb-2" weight="semibold" size="lg">매물 상세 정보</BaseTypography>
    <div class="px-1 pb-2">
      <div class="grid grid-cols-[115px,1fr] text-sm border rounded-md overflow-hidden">
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
          >방 수</BaseTypography
        >
        <BaseTypography weight="regular" class="px-3 py-2"
          >{{ property.roomCount }}개</BaseTypography
        >
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
          >욕실 수</BaseTypography
        >
        <BaseTypography weight="regular" class="px-3 py-2"
          >{{ property.bathroomCount }}개</BaseTypography
        >
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
          >해당 층 수</BaseTypography
        >
        <BaseTypography weight="regular" class="px-3 py-2">{{ property.floor }}층</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
          >해시 태그</BaseTypography
        >
        <BaseTypography
          weight="regular"
          class="px-3 py-2 flex flex-wrap gap-1"
          v-if="normalizedTags.length"
        >
          <span
            v-for="(tag, i) in normalizedTags"
            :key="tag + '-' + i"
            class="bg-gray-100 px-1.5 py-1 rounded-full text-xs text-gray-600"
            :title="tag"
          >
            #{{ tag }}
          </span>
        </BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2" weight="regular" color="gray-1"
          >세부 정보</BaseTypography
        >
        <BaseTypography weight="regular" class="px-3 py-2">{{
          property.description
        }}</BaseTypography>
        <BaseTypography class="bg-gray-50 px-3 py-2 col-span-2" weight="regular" color="gray-1"
          >이미지</BaseTypography
        >
        <div class="col-span-2 p-3">
          <div class="relative w-full h-60">
            <img
              :src="property.images?.[currentImageIndex]?.photoUrl || '/fallback.png'"
              class="w-full h-full object-contain mx-auto"
              alt="매물 이미지"
            />
            <div
              v-if="imageCount > 1"
              class="absolute left-0 top-0 w-1/2 h-full cursor-pointer"
              @click="prevImage"
            ></div>
            <div
              v-if="imageCount > 1"
              class="absolute right-0 top-0 w-1/2 h-full cursor-pointer"
              @click="nextImage"
            ></div>
            <div
              v-if="imageCount > 1"
              class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/70 rounded-full px-2 py-1"
            >
              <button
                v-for="(_, i) in imageCount"
                :key="i"
                class="w-1.5 h-1.5 rounded-full transition-all"
                :class="i === currentImageIndex ? 'w-3 h-1.5 bg-black' : 'bg-gray-300'"
                @click.stop="goTo(i)"
                :aria-label="`이미지 ${i + 1} 보기`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section v-if="property.seller" class="mt-4 px-2 bg-white">
    <BaseTypography class="mb-2" weight="semibold" size="lg">매물 서류</BaseTypography>
    <div class="px-1 pb-2">
      <div class="p-4 grid text-sm border rounded-md overflow-hidden">
        <ul>
          <li v-for="doc in property.documents" :key="doc.fileUrl">
            <a
              :href="doc.fileUrl"
              class="text-blue-500 underline pb-3"
              target="_blank"
              :download="getDocumentName(doc.documentType)"
            >
              {{ getDocumentName(doc.documentType) }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseTypography from '@/components/common/Typography/BaseTypography.vue'

const props = defineProps({
  property: Object,
})

const maxTagsToShow = 6
const normalizedTags = computed(() => {
  const raw = Array.isArray(props.property?.tags) ? props.property.tags : []
  return raw
    .map((t) => (typeof t === 'string' ? t.trim() : ''))
    .filter((t) => t.length > 0)
    .slice(0, maxTagsToShow)
})

function getDocumentName(type) {
  switch (type) {
    case 'OWNERSHIP_CERTIFICATE':
      return '등기권리증'
    case 'SEAL_CERTIFICATE':
      return '매도용 인감증명서'
    case 'POWER_OF_ATTORNEY':
      return '위임장'
    case 'RESIDENT_REGISTRATION':
      return '주민등록등본'
    case 'ID_COPY':
      return '신분증 사본'
    case 'STANDARD_CONTRACT':
      return '표준부동산매매계약서'
    case 'LEASE_CONTRACT':
      return '임대차 계약서'
    default:
      return '기타 문서'
  }
}

const currentImageIndex = ref(0)
const images = computed(() => props.property?.images ?? [])
const imageCount = computed(() => images.value.length)
const goTo = (i) => {
  const n = imageCount.value
  if (!n) return
  currentImageIndex.value = (i + n) % n
}
const nextImage = () => goTo(currentImageIndex.value + 1)
const prevImage = () => goTo(currentImageIndex.value - 1)
</script>
