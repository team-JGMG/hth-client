import { defineStore } from 'pinia'

const DEFAULT_TIMEOUTS = {
  success: 2500,
  error: 3500,
  warn: 3000,
  info: 2500,
}

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [],
    max: 5,
  }),
  actions: {
    show(payload = {}) {
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

      if (this.items.length > this.max) this.items.shift()

      if (timeout > 0) {
        setTimeout(() => this.remove(id), timeout)
      }
      return id
    },

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
