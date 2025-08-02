// 매물 api(등록, 조회, 삭제)
import axios from 'axios'

export const fetchSoldProperties = async () => {
  try {
    const response = await axios.get('https://half-to-half.site/api/property/sold')
    console.log('[🖤응답 확인]', response.data)
    return response.data.data || []
  } catch (error) {
    console.error('매각 완료 매물 조회 실패:', error)
    return []
  }
}
