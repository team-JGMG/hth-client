// utils/format.js

//날짜 2025.7.23 12:00 형식
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
