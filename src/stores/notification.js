// src/stores/notification.js
import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

import { defineStore } from 'pinia'

// 어떤 형태든 배열만 안전하게 추출
const normalizeList = (res) => {
  const candidate = res?.data?.data ?? res?.data ?? res ?? []
  return Array.isArray(candidate) ? candidate : []
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    /** @type {Array<{notificationId:number,title:string,body:string,createdAt:string,read:boolean}>} */
    items: [],
    loading: false,
    error: null,
  }),
  getters: {
    unreadCount: (s) => s.items.filter((i) => !i.read).length,
    hasUnread: (s) => s.items.some((i) => !i.read),
  },
  actions: {
    async fetch() {
      this.loading = true
      this.error = null
      try {
        const res = await getNotifications()
        const list = normalizeList(res)
        // 서버 응답으로 덮어쓰기 + 정렬
        this.items = list.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } catch (e) {
        this.error = e?.message || '알림을 불러오지 못했습니다.'
      } finally {
        this.loading = false
      }
    },

    async readOne(id) {
      try {
        await markNotificationRead(id)
        const t = this.items.find((i) => i.notificationId === id)
        if (t) t.read = true
      } catch (e) {
        console.error('readOne failed:', e)
      }
    },

    async readAll() {
      try {
        await markAllRead()
        this.items = this.items.map((i) => ({ ...i, read: true }))
      } catch (e) {
        console.error('readAll failed:', e)
      }
    },

    // 서버 동기화(디바운스)
    refreshSoon: (() => {
      let timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(() => this.fetch(), 800)
      }
    })(),
  },
})
