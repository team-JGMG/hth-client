import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

import { defineStore } from 'pinia'

function extractList(res) {
  let payload = res
  if (res && typeof res === 'object' && 'data' in res) payload = res.data
  if (payload && typeof payload === 'object' && 'data' in payload) payload = payload.data
  if (payload && typeof payload === 'object' && Array.isArray(payload.content))
    return payload.content
  return Array.isArray(payload) ? payload : []
}

function toTime(v) {
  if (!v) return 0
  const t = new Date(v).getTime()
  return Number.isFinite(t) ? t : 0
}

function normalize(item) {
  return {
    notificationId: item.notificationId ?? item.id,
    title: item.title ?? '',
    body: item.body ?? '',
    createdAt: item.createdAt ?? item.created_at ?? null,
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

    refreshSoon: (() => {
      let timer = null
      return function (opts) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => this.fetch(opts), 800)
      }
    })(),
  },
})
