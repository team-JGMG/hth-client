import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    items:
      /** @type {Array<{notificationId:number,title:string,body:string,createdAt:string,read:boolean}>} */ ([]),
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
        // 최신순 정렬(선택)
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
    // FCM 수신 시 목록 새로고침용 (중복 호출 방지 간단 디바운스)
    refreshSoon: (() => {
      let timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(() => this.fetch(), 600)
      }
    })(),
  },
})
