import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    items: [], // [{ id, title, body, type, timeout }]
    max: 5, // 동시에 보일 최대 개수 (원하면 수정)
  }),
  actions: {
    show({ title = '알림', body = '', type = 'info', timeout = 3000 } = {}) {
      const id = `${Date.now()}_${Math.random()}`
      this.items.push({ id, title, body, type, timeout })

      // 최대 개수 초과 시 앞에서 제거 (FIFO)
      if (this.items.length > this.max) this.items.shift()

      if (timeout > 0) {
        setTimeout(() => this.remove(id), timeout)
      }
      return id
    },
    remove(id) {
      this.items = this.items.filter((t) => t.id !== id)
    },
    clear() {
      this.items = []
    },
  },
})
