import { defineStore } from 'pinia'

const DEFAULT_TIMEOUTS = {
  success: 2500,
  error: 3500,
  warn: 3000,
  info: 2500,
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [], // [{ id, title, body, type, timeout }]
    max: 5, // 동시에 보일 최대 개수
  }),
  actions: {
    /**
     * 사용법:
     *  - show('메시지')  // 기본 info
     *  - show({ title:'제목', body:'본문', type:'error', timeout:4000 })
     */
    show(payload = {}) {
      // 문자열만 전달되면 body로 간주
      if (typeof payload === 'string') {
        payload = { body: payload }
      }

      const {
        title = '알림',
        body = '',
        type = 'info',
        timeout = DEFAULT_TIMEOUTS[type] ?? 2500,
      } = payload

      const id = `${Date.now()}_${Math.random()}`
      this.items.push({ id, title, body, type, timeout })

      // 최대 개수 유지(FIFO)
      if (this.items.length > this.max) this.items.shift()

      // 자동 제거
      if (timeout > 0) {
        setTimeout(() => this.remove(id), timeout)
      }
      return id
    },

    // 헬퍼
    success(p) {
      return this.show({ ...(typeof p === 'string' ? { body: p } : p), type: 'success' })
    },
    error(p) {
      return this.show({ ...(typeof p === 'string' ? { body: p } : p), type: 'error' })
    },
    warn(p) {
      return this.show({ ...(typeof p === 'string' ? { body: p } : p), type: 'warn' })
    },
    info(p) {
      return this.show({ ...(typeof p === 'string' ? { body: p } : p), type: 'info' })
    },

    remove(id) {
      this.items = this.items.filter((t) => t.id !== id)
    },
    clear() {
      this.items = []
    },
  },
})
