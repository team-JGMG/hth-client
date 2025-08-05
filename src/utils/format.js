// utils/format.js

//날짜+시간 2025.7.23 12:00 형식 (배열 받아옴)
export function formatDateTime(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return '-'
  const [year, month, day, hour, minute] = dateArray.map(Number)

  // 유효성 검사
  if ([year, month, day, hour, minute].some((v) => isNaN(v))) return '-'
  const date = new Date(year, month - 1, day, hour, minute)
  if (isNaN(date.getTime())) return '-'
  return `${year}.${month}.${day} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
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
  if (!val) return '-'
  const man = Math.floor(val / 10000)
  return `${man.toLocaleString()}만원`
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

// 금액 포맷터 (예: 100000000 → 10억원)
export function formatAmount(amount) {
  if (!amount) return ''
  if (amount >= 100000000) return `${amount / 100000000}억원`
  if (amount >= 10000) return `${amount / 10000}만원`
  return `${amount}원`
}
