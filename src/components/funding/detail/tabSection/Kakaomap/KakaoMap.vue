<template>
  <div ref="mapContainer" class="w-full h-[300px] rounded-lg z-0"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPropertyMapData } from '@/api/property'

const mapContainer = ref(null)
const route = useRoute()
const propertyId = route.params.id || 1

const loadMap = async () => {
  try {
    const mapData = await getPropertyMapData(propertyId)

    const latitude = 37.5485601
    const longitude = 127.074738

    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false&libraries=services`
    script.onload = () => {
      window.kakao.maps.load(() => {
        const center = new window.kakao.maps.LatLng(latitude, longitude)
        const map = new window.kakao.maps.Map(mapContainer.value, {
          center,
          level: 3,
        })

        const markerImageSrc = 'https://i.ibb.co/xK8ZD34f/marker.png'
        const markerSize = new window.kakao.maps.Size(40, 40)
        const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, markerSize)

        new window.kakao.maps.Marker({
          map,
          position: center,
          image: markerImage,
        })

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
      })
    }

    document.head.appendChild(script)
  } catch (err) {
    console.error('지도 로딩 실패: ', err)
  }
}

onMounted(() => {
  loadMap()
})
</script>
