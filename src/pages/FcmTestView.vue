<script setup>
import { computed, onMounted } from 'vue'
import DetailLayout from '@/layouts/DetailLayout.vue'
import DetailHeader from '@/layouts/DetailHeader.vue'
import { useNotificationStore } from '@/stores/notification'

const nStore = useNotificationStore()

onMounted(() => nStore.fetch())

const yyyymmddDot = (iso) => {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}.`
}
const hhmm = (iso) => {
  const d = new Date(iso)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

const grouped = computed(() =>
  nStore.items
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .reduce((acc, n) => {
      const key = yyyymmddDot(n.createdAt)
      ;(acc[key] ||= []).push(n)
      return acc
    }, {}),
)
</script>

<template>
  <DetailLayout>
    <DetailHeader>알림</DetailHeader>

    <!-- 상단 컨트롤 -->
    <div class="flex items-center justify-between px-2 mb-2">
      <div class="text-sm text-gray-500">안 읽음 {{ nStore.unreadCount }}개</div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          @click="nStore.readAll"
          :disabled="!nStore.hasUnread"
        >
          전체 읽음
        </button>
        <button
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
          @click="nStore.fetch"
          :disabled="nStore.loading"
        >
          새로고침
        </button>
      </div>
    </div>

    <div v-if="nStore.loading" class="text-center text-gray-500 py-4">불러오는 중…</div>
    <div v-else-if="nStore.error" class="text-center text-red-500 py-4">{{ nStore.error }}</div>

    <!-- 날짜별 섹션 -->
    <section v-else class="mt-2 space-y-8">
      <div v-for="(list, date) in grouped" :key="date" class="px-2">
        <h3 class="text-[15px] font-semibold text-gray-600 mb-3 px-1">{{ date }}</h3>

        <div class="space-y-3">
          <article
            v-for="n in list"
            :key="n.notificationId"
            class="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 relative"
          >
            <time class="absolute right-3 top-2 text-[11px] text-gray-400">
              {{ hhmm(n.createdAt) }}
            </time>

            <div class="pr-16">
              <p
                class="text-[13px] font-semibold leading-snug"
                :class="n.read ? 'text-gray-400' : 'text-gray-900'"
              >
                {{ n.title }}
              </p>
              <p class="mt-2 text-[13px] text-gray-800 leading-snug whitespace-pre-line">
                {{ n.body }}
              </p>

              <div class="mt-2" v-if="!n.read">
                <button
                  class="text-xs px-2 py-1 rounded bg-blue-500 text-white"
                  @click="nStore.readOne(n.notificationId)"
                >
                  읽음 처리
                </button>
              </div>
            </div>

            <span
              class="absolute left-3 top-3 w-2 h-2 rounded-full"
              :class="n.read ? 'bg-gray-300' : 'bg-blue-500'"
              title="읽음 상태"
            />
          </article>
        </div>
      </div>

      <div v-if="!nStore.items.length" class="text-center text-gray-400 py-16">
        알림이 없습니다.
      </div>
    </section>
  </DetailLayout>
</template>
