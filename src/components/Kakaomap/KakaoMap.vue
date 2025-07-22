<template>
  <div class="w-full max-w-full overflow-hidden">
    <KakaoMap :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true">
      <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng" />
    </KakaoMap>
  </div>
</template>

<script setup>
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps'
import { ref, onMounted } from 'vue'

const defaultCoordinates = {
  lat: 37.548105,
  lng: 127.073549,
}

const coordinate = ref({ ...defaultCoordinates })

const fetchPropertyData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return {
    propertyId: 101,
    userId: 1,
    title: '삼성역 인근 상가',
    address: '서울특별시 강남구 테헤란로 441',
    area: '132m²',
    price: 8500000000,
    fundingStartDate: '2025-08-01',
    fundingEndDate: '2025-08-31',
    status: 'FUNDING',
    usageDistrict: '상업지역',
    landArea: 132.0,
    buildingArea: 210.5,
    totalFloorAreaProperty: 210.5,
    totalFloorAreaBuilding: 550.75,
    basementFloors: 1,
    groundFloors: 4,
    approvalDate: '2019-06-30',
    officialLandPrice: 425000000,
    unitPricePerPyeong: 25000000,
    propertyType: '근린생활시설',
    roomCount: 4,
    bathroomCount: 2,
    floor: 2,
    description: '삼성역 도보 3분 거리, 공실 없음',
    createdAt: '2025-07-21T10:00:00',
    updatedAt: '2025-07-21T10:00:00',
    soldAt: null,
    documents: [],
    photos: [],
  }
}

const getCoordinatesFromAddress = (address) => {
  return new Promise((resolve) => {
    if (
      !window.kakao ||
      !window.kakao.maps ||
      !window.kakao.maps.services ||
      !window.kakao.maps.services.Geocoder
    ) {
      console.error('카카오 지도 SDK Geocoding 서비스가 로드되지 않았습니다.')
      return resolve(null)
    }

    const geocoder = new kakao.maps.services.Geocoder()

    geocoder.addressSearch(address, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        if (result.length > 0) {
          const firstResult = result[0]
          const coords = {
            lat: parseFloat(firstResult.y),
            lng: parseFloat(firstResult.x),
          }
          resolve(coords)
        } else {
          console.warn(`주소 "${address}"에 대한 Geocoding 결과가 없습니다.`)
          resolve(null)
        }
      } else {
        console.error(`Geocoding 실패: ${status} (주소: "${address}")`)
        resolve(null)
      }
    })
  })
}

const waitForKakaoMapLoad = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      return resolve()
    }

    let attempts = 0
    const maxAttempts = 150
    const intervalTime = 200

    const checkSdkLoaded = setInterval(() => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        clearInterval(checkSdkLoaded)
        resolve()
      } else if (attempts >= maxAttempts) {
        clearInterval(checkSdkLoaded)
        console.error('카카오 지도 SDK 로드 시간 초과')
        reject(new Error('Kakao Map SDK load timed out.'))
      }
      attempts++
    }, intervalTime)
  })
}

onMounted(async () => {
  const propertyData = await fetchPropertyData()

  if (propertyData && propertyData.address) {
    try {
      await waitForKakaoMapLoad()
    } catch (error) {
      console.error('카카오 지도 SDK 로드 중 오류 발생:', error)
      coordinate.value = { ...defaultCoordinates }
      return
    }

    const newCoordinates = await getCoordinatesFromAddress(propertyData.address)

    if (newCoordinates) {
      coordinate.value = newCoordinates
    } else {
      console.warn('주소의 좌표를 찾을 수 없어 기본 좌표를 사용합니다.')
      coordinate.value = { ...defaultCoordinates }
    }
  } else {
    console.warn('목 데이터에 주소가 없거나 데이터를 가져오지 못했습니다. 기본 좌표를 사용합니다.')
    coordinate.value = { ...defaultCoordinates }
  }
})
</script>
