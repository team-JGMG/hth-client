<template>
  <div class="relative w-full h-[300px] rounded-lg z-0">
    <div ref="mapContainer" class="absolute inset-0 rounded-lg"></div>

    <MapSkeleton v-if="isLoading" class="absolute inset-0" />

    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center text-sm text-gray-600 bg-gray-50 rounded-lg"
    >
      지도를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import MapSkeleton from '@/components/common/Skeleton/MapSkeleton.vue'
import { getPropertyMapData, getCoordinatesByAddress, getPropertyDetail } from '@/api/property'

function pickAddress(d) {
  return (d && (d.roadAddress || d.address || d.jibunAddress || d.addr)) || null
}

const mapContainer = ref(null)
const route = useRoute()
const isLoading = ref(true)
const hasError = ref(false)
let mapInstance = null

const loadKakaoScript = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }
    const exists = document.querySelector('script[data-kakao-sdk]')
    if (exists) {
      exists.addEventListener('load', () => window.kakao.maps.load(resolve), { once: true })
      exists.addEventListener('error', reject, { once: true })
      return
    }
    const script = document.createElement('script')
    script.setAttribute('data-kakao-sdk', 'true')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`
    script.onload = () => window.kakao.maps.load(resolve)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const loadMap = async () => {
  try {
    const fundingId = Number(route.params.id)
    let address = route.query?.address
    if (!address) {
      try {
        const detail = await getPropertyDetail(fundingId)
        address = pickAddress(detail?.data ?? detail)
      } catch {
        /* ignore */
      }
    }

    let latitude, longitude
    const mapData = await getPropertyMapData(fundingId)

    if (address) {
      try {
        const center = await getCoordinatesByAddress(address)
        latitude = Number(center?.latitude)
        longitude = Number(center?.longitude)
      } catch {
        /* ignore */
      }
    }

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      const first = Array.isArray(mapData) && mapData.length ? mapData[0] : null
      if (!first) {
        throw new Error('no-mapdata')
      }
      latitude = Number(first.latitude)
      longitude = Number(first.longitude)
    }

    await loadKakaoScript()

    const center = new window.kakao.maps.LatLng(latitude, longitude)
    mapInstance = new window.kakao.maps.Map(mapContainer.value, {
      center,
      level: 6,
    })

    const markerImageSrc = 'https://i.ibb.co/xK8ZD34f/marker.png'
    const markerSize = new window.kakao.maps.Size(40, 40)
    const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerSize)
    new window.kakao.maps.Marker({ map: mapInstance, position: center, image: markerImage })

    if (Array.isArray(mapData)) {
      mapData.forEach((data) => {
        if (!Number.isFinite(Number(data.latitude)) || !Number.isFinite(Number(data.longitude)))
          return
        const position = new window.kakao.maps.LatLng(Number(data.latitude), Number(data.longitude))
        const content = `
          <div style="
            display:inline-block;border-radius:6px;overflow:hidden;
            box-shadow:0 1px 4px rgba(0,0,0,0.2);font-family:sans-serif;text-align:center;white-space:nowrap;">
            <div style="background:#000;color:#fff;font-weight:bold;font-size:12px;padding:4px 8px;">
              ${data.dealAmount ?? '-'}
            </div>
            <div style="background:#fff;color:#000;font-size:10px;padding:2px 8px;">
              ${data.dealYearMonth ?? ''}년
            </div>
          </div>
        `
        const overlay = new window.kakao.maps.CustomOverlay({ position, content, yAnchor: 1.6 })
        overlay.setMap(mapInstance)
      })
    }

    isLoading.value = false
  } catch (e) {
    hasError.value = true
    isLoading.value = false
    console.error('[KakaoMap] load error:', e)
  }
}

onMounted(() => {
  const timeout = setTimeout(() => {
    if (isLoading.value) hasError.value = true
  }, 15000)
  loadMap().finally(() => clearTimeout(timeout))
})

onBeforeUnmount(() => {
  mapInstance = null
})
</script>
