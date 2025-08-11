// src/stores/notification.js
import { getNotifications, markAllRead, markNotificationRead } from '@/api/notification'

import { defineStore } from 'pinia'

const normalizeList = (res) => res?.data?.data ?? []

// notificationId 기준으로 병합(서버 데이터 우선)
const mergeById = (current, incoming) => {
  const map = new Map(current.map((n) => [n.notificationId, n]))
  for (const n of incoming) {
    map.set(n.notificationId, { ...(map.get(n.notificationId) || {}), ...n, optimistic: false })
  }
  return Array.from(map.values())
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    /** @type {Array<{notificationId:number,title:string,body:string,createdAt:string,read:boolean,optimistic?:boolean}>} */
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
        const serverList = normalizeList(res)

        // 서버가 아직 비어있으면 기존(낙관적) 리스트 유지
        if (serverList.length === 0) {
          this.items = this.items
            .slice()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          return
        }

        // 서버 응답과 병합(서버 우선), 정렬
        this.items = mergeById(this.items, serverList).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        )
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

    // 낙관적 데이터 유지
    add({ title, body, createdAt, id, read = false }) {
      const notificationId = id ?? Date.now()
      if (this.items.some((n) => n.notificationId === notificationId)) return
      this.items.unshift({
        notificationId,
        title: title ?? '알림',
        body: body ?? '',
        createdAt: createdAt ?? new Date().toISOString(),
        read,
        optimistic: true, // 서버 미반영 상태 표시
      })
    },

    // 서버와 동기화(디바운스)
    refreshSoon: (() => {
      let timer = null
      return function () {
        clearTimeout(timer)
        timer = setTimeout(() => this.fetch(), 800)
      }
    })(),
  },
})
