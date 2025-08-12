// src/stores/notification.js
import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

import { defineStore } from 'pinia'

// 응답에서 리스트만 안정적으로 추출 (옵셔널 체이닝/?? 미사용)
function extractList(res) {
  let payload = res
  if (res && typeof res === 'object' && 'data' in res) payload = res.data
  if (payload && typeof payload === 'object' && 'data' in payload) payload = payload.data
  return Array.isArray(payload) ? payload : []
}

// 날짜 정렬용
function toTime(v) {
  if (!v) return 0
  const t = new Date(v).getTime()
  return isFinite(t) ? t : 0
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    /** @type {Array<{notificationId:number,title:string,body:string,createdAt:string,isRead:boolean}>} */
    items: [],
    loading: false,
    error: null,
  }),

  getters: {
    unreadCount: (s) => s.items.filter((i) => !i.isRead).length,
    hasUnread: (s) => s.items.some((i) => !i.isRead),
  },

  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const res = await getNotifications()
        const list = extractList(res) // ApiCommonResponse 래퍼든 아니든 대응
        // 백엔드 DTO 필드명(notificationId, title, body, isRead, createdAt)에 맞춰 그대로 사용
        this.items = list.slice().sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
      } catch (e) {
        this.error = (e && e.message) || '알림을 불러오지 못했습니다.'
      } finally {
        this.loading = false
      }
    },

    async readOne(id) {
      // 낙관적 업데이트 + 실패 롤백
      const t = this.items.find((i) => i.notificationId === id)
      const prev = t ? t.isRead : null
      if (t) t.isRead = true
      try {
        await markNotificationRead(id) // axios.put(url, {}) 권장(빈 바디)
      } catch {
        if (t) t.isRead = prev
        // console.error('readOne failed:', e)
      }
    },

    async readAll() {
      const snapshot = this.items.map((i) => ({ ...i }))
      this.items = this.items.map((i) => ({ ...i, isRead: true }))
      try {
        await markAllRead()
      } catch {
        this.items = snapshot
        // console.error('readAll failed:', e)
      }
    },

    // 서버 동기화(디바운스)
    refreshSoon: (() => {
      let timer = null
      return function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => this.fetch(), 800)
      }
    })(),
  },
})