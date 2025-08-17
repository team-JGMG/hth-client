<template>
  <div ref="mapContainer" class="w-full h-[300px] rounded-lg z-0"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPropertyMapData, getCoordinatesByAddress, getPropertyDetail } from '@/api/property'
function pickAddress(d) {
  return (d && (d.roadAddress || d.address || d.jibunAddress || d.addr)) || null
}
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
    const fundingId = Number(route.params.id)
    let address = route.query?.address
    if (!address) {
      try {
        const detail = await getPropertyDetail(fundingId)
        address = pickAddress(detail?.data ?? detail)
      } catch {
        //
      }
    }
    let latitude
    let longitude
    const mapData = await getPropertyMapData(fundingId)
    if (address) {
      try {
        const center = await getCoordinatesByAddress(address)
        latitude = Number(center?.latitude)
        longitude = Number(center?.longitude)
      } catch {
        //
      }
    }
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      const first = Array.isArray(mapData) && mapData.length ? mapData[0] : null
      if (!first) {
        return
      }
      latitude = Number(first.latitude)
      longitude = Number(first.longitude)
    }
    await loadKakaoScript()

    const center = new window.kakao.maps.LatLng(latitude, longitude)
    const map = new window.kakao.maps.Map(mapContainer.value, {
      center,
      level: 6,
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
  } catch {
    //
  }
}

onMounted(() => {
  loadMap()
})
</script>
