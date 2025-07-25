// utils/format.js

//날짜+시간 2025.7.23 12:00 형식
export function formatDateTime(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes().toString().padStart(2, '0')
  return `${year}.${month}.${day} ${hour}:${minute}`
}

//날짜만 2025.7.23 형식
export const formatDate = (val) => {
  if (!val) return '-'
  const date = new Date(val)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

//금액 만원 형식 변환
export function formatPriceInManwon(val) {
  return val ? `${(val / 10000).toLocaleString()}만원` : '-'
}

//금액 억 변환
export function formatPriceInEokwon(val) {
  return val ? `${(val / 100000000).toFixed(0)}억` : '-'
}

//미터제곱 평 변환 (1㎡ ≒ 0.3025평)
export function formatAreaToPyeong(area) {
  if (!area || isNaN(area)) return '-'
  const pyeong = area * 0.3025
  return `${pyeong.toFixed(1)}평`
}

//전화번호 '-' 추가
export const format = (val) => (typeof val === 'number' ? val.toLocaleString() : val || '-')

//디데이 계산
export const dDay = (val) => {
  if (!val) return '-'
  const end = new Date(val)
  const today = new Date()
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}
