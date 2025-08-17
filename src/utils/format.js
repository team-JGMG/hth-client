export function formatDateTime(dateArray) {
  if (!Array.isArray(dateArray) || dateArray.length < 5) return '-'
  const [year, month, day, hour, minute] = dateArray.map(Number)

  if ([year, month, day, hour, minute].some((v) => isNaN(v))) return '-'
  const date = new Date(year, month - 1, day, hour, minute)
  if (isNaN(date.getTime())) return '-'
  return `${year}.${month}.${day} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export const formatDate = (val) => {
  if (!val) return '-'
  const date = new Date(val)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

export function formatPriceInManwon(val) {
  if (!val) return '-'
  const man = Math.floor(val / 10000)
  return `${man.toLocaleString()}만원`
}
export function formatPriceInEokwon(val) {
  return val ? `${(val / 100000000).toFixed(1)}억` : '-'
}

export function formatAreaToPyeong(area) {
  if (!area || isNaN(area)) return '-'
  const pyeong = area * 0.3025
  return `${pyeong.toFixed(1)}평`
}

export const format = (val) => (typeof val === 'number' ? val.toLocaleString() : val || '-')

export const dDay = (val) => {
  if (!val) return '-'
  const end = new Date(val)
  const today = new Date()
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

export function formatAmount(amount) {
  if (!amount) return ''
  if (amount >= 100000000) return `${amount / 100000000}억원`
  if (amount >= 10000) return `${amount / 10000}만원`
  return `${amount}원`
}

export const formatPhoneNumber = (val) => {
  if (!val) return '-'

  const cleaned = val.replace(/[^0-9]/g, '')

  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  }

  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3')
  }

  return val
}
