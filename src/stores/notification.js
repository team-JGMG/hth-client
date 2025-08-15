import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

// src/stores/notification.js
import { defineStore } from 'pinia'

// 응답에서 리스트만 안정적으로 추출 + 페이지네이션 대응(content 지원)
function extractList(res) {
  let payload = res
  if (res && typeof res === 'object' && 'data' in res) payload = res.data
  if (payload && typeof payload === 'object' && 'data' in payload) payload = payload.data
  // 페이지 객체일 경우 content를 우선 사용
  if (payload && typeof payload === 'object' && Array.isArray(payload.content))
    return payload.content
  return Array.isArray(payload) ? payload : []
}

// 날짜 정렬용
function toTime(v) {
  if (!v) return 0
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? t : 0
}

// 서버 응답 스키마 → 프론트 공통 스키마로 정규화
function normalize(item) {
  return {
    notificationId: item.notificationId ?? item.id,
    title: item.title ?? '',
    body: item.body ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
    // 핵심: read/isRead 모두 대응
    isRead: 'isRead' in item ? !!item.isRead : !!item.read,
  }
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
    /**
     * 목록 조회
     * @param {{ readStatus?: 'all'|'unread', page?:number, size?:number }} opts
     */
    async fetch(opts = {}) {
      this.loading = true
      this.error = null
      try {
        // 필요 시 readStatus: 'unread'로 호출 (백엔드 요청사항 반영)
        const res = await getNotifications(opts)
        const list = extractList(res).map(normalize)
        this.items = list.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
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
        await markNotificationRead(id)
      } catch {
        if (t) t.isRead = prev
      }
    },

    async readAll() {
      const snapshot = this.items.map((i) => ({ ...i }))
      this.items = this.items.map((i) => ({ ...i, isRead: true }))
      try {
        await markAllRead()
      } catch {
        this.items = snapshot
      }
    },

    // 서버 재동기화(디바운스)
    refreshSoon: (() => {
      let timer = null
      return function (opts) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => this.fetch(opts), 800)
      }
    })(),
  },
})
