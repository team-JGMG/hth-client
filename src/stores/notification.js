import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

import { defineStore } from 'pinia'

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
        const data = await getNotifications()
        this.items = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } catch (e) {
        this.error = e?.message || '알림을 불러오지 못했습니다.'
      } finally {
        this.loading = false
      }
    },

    async readOne(id) {
      await markNotificationRead(id)
      const idx = this.items.findIndex((i) => i.notificationId === id)
      if (idx >= 0) this.items[idx].read = true
    },

    async readAll() {
      await markAllRead()
      this.items = this.items.map((i) => ({ ...i, read: true }))
    },

    // ✅ FCM 수신 시 즉시 목록에 추가(낙관적)
    add({ title, body, createdAt, id, read = false }) {
      const notificationId = id ?? Date.now()
      this.items.unshift({
        notificationId,
        title: title ?? '알림',
        body: body ?? '',
        createdAt: createdAt ?? new Date().toISOString(),
        read,
      })
    },

    // ✅ 서버와 동기화(디바운스)
    refreshSoon: (() => {
      let timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(() => this.fetch(), 600)
      }
    })(),
  },
})
