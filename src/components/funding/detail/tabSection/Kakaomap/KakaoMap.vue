<template>
  <div ref="mapContainer" class="w-full h-[300px] rounded-lg z-0"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPropertyMapData, getPropertyCoordinates } from '@/api/property'

const mapContainer = ref(null)
const route = useRoute()

const loadKakaoScript = () => {
  return new Promise((resolve) => {
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`
    script.onload = () => window.kakao.maps.load(resolve)
    document.head.appendChild(script)
  })
}

const loadMap = async () => {
  try {
    const propertyId = Number(route.params.id)
    console.log('요청할 propertyId:', propertyId)

    // 중심 좌표 조회
    const { latitude, longitude } = await getPropertyCoordinates(propertyId)
    if (!latitude || !longitude) {
      console.warn('잘못된 좌표입니다:', latitude, longitude)
      return
    }

    // 주변 시세 조회
    const mapData = await getPropertyMapData(propertyId)

    await loadKakaoScript()

    const center = new window.kakao.maps.LatLng(latitude, longitude)
    const map = new window.kakao.maps.Map(mapContainer.value, {
      center,
      level: 3,
    })

    // 메인 마커
    const markerImageSrc = 'https://i.ibb.co/xK8ZD34f/marker.png'
    const markerSize = new window.kakao.maps.Size(40, 40)
    const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerSize)

    new window.kakao.maps.Marker({
      map,
      position: center,
      image: markerImage,
    })

    // 주변 시세 마커
    mapData.forEach((data) => {
      const position = new window.kakao.maps.LatLng(data.latitude, data.longitude)

      const content = `
        <div style="
          display: inline-block;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          font-family: sans-serif;
          text-align: center;
          white-space: nowrap;
        ">
          <div style="
            background: #000000;
            color: #ffffff;
            font-weight: bold;
            font-size: 12px;
            padding: 4px 8px;
          ">
            ${data.dealAmount}
          </div>
          <div style="
            background: #ffffff;
            color: #000000;
            font-size: 10px;
            padding: 2px 8px;
          ">
            ${data.dealYearMonth}년
          </div>
        </div>
      `

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.6,
      })

      overlay.setMap(map)
    })
  } catch (err) {
    console.error('지도 로딩 실패:', err)
  }
}

onMounted(() => {
  loadMap()
})
</script>
