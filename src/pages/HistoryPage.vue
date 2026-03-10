<template>
  <div class="animate-fade-in">
    <div class="page-header flex items-center justify-between">
      <div>
        <h1 class="page-title">📋 Lịch Sử Tính Toán</h1>
        <p class="page-subtitle">Lưu trữ tất cả các lần tính toán gần đây</p>
      </div>
      <button v-if="hasAnyHistory" @click="showClearConfirm = true" class="btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm">
        🗑️ Xóa tất cả
      </button>
    </div>

    <!-- Tab Filter -->
    <div class="flex gap-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-medium transition-all',
          activeTab === tab.key
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
        ]"
      >
        {{ tab.icon }} {{ tab.label }}
        <span v-if="getCount(tab.key) > 0" class="ml-1.5 text-xs bg-brand-500 text-white rounded-full px-1.5 py-0.5">
          {{ getCount(tab.key) }}
        </span>
      </button>
    </div>

    <!-- History List -->
    <div v-if="currentHistory.length > 0" class="space-y-3">
      <div
        v-for="item in currentHistory"
        :key="item.id"
        class="card-hover p-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1.5">
              <span class="text-base">{{ getTabIcon(activeTab) }}</span>
              <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{{ item.label }}</span>
            </div>
            <div class="flex flex-wrap gap-2 text-xs text-slate-400">
              <span class="font-mono">{{ formatDate(item.timestamp) }}</span>
              <template v-if="activeTab === 'salary'">
                <span class="tag-teal">{{ item.mode === 'gross-to-net' ? 'G→N' : 'N→G' }}</span>
                <span>{{ item.dependents }} phụ thuộc</span>
                <span class="font-mono">Thuế: {{ item.tax?.toFixed(2) }}tr</span>
              </template>
              <template v-if="activeTab === 'loan'">
                <span class="tag bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">{{ item.loanType }}</span>
                <span class="font-mono">{{ item.annualRate }}%/năm</span>
                <span class="font-mono">{{ item.termYears }} năm</span>
              </template>
              <template v-if="activeTab === 'tax'">
                <span class="tag-orange">{{ item.period === 'monthly' ? 'Tháng' : 'Năm' }}</span>
                <span class="font-mono">Tỷ lệ: {{ item.effectiveTaxRate?.toFixed(1) }}%</span>
              </template>
            </div>
          </div>
          <button
            @click="deleteItem(item.id)"
            class="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 flex-shrink-0"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="card p-16 text-center">
      <div class="text-5xl mb-4">📭</div>
      <div class="text-slate-500 dark:text-slate-400 text-sm">
        Chưa có lịch sử {{ tabs.find(t => t.key === activeTab)?.label?.toLowerCase() }}.<br>
        Hãy thực hiện tính toán và lưu lại!
      </div>
    </div>

    <!-- Clear Confirm Modal -->
    <Transition name="modal">
      <div v-if="showClearConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showClearConfirm = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative card p-6 max-w-sm w-full">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 mb-2">Xóa tất cả lịch sử?</h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Hành động này không thể hoàn tác.</p>
          <div class="flex gap-3">
            <button @click="showClearConfirm = false" class="btn-secondary flex-1">Hủy</button>
            <button @click="confirmClear" class="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors">Xóa</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getHistory, clearHistory, deleteHistoryItem, HISTORY_TYPES } from '@/utils/storage.js'

const activeTab = ref('salary')
const showClearConfirm = ref(false)

const histories = ref({
  salary: getHistory(HISTORY_TYPES.SALARY),
  loan: getHistory(HISTORY_TYPES.LOAN),
  tax: getHistory(HISTORY_TYPES.TAX),
})

const tabs = [
  { key: 'salary', label: 'Tính Lương', icon: '💰' },
  { key: 'loan', label: 'Tính Vay', icon: '🏦' },
  { key: 'tax', label: 'Thuế TNCN', icon: '📊' },
]

const currentHistory = computed(() => histories.value[activeTab.value] || [])
const hasAnyHistory = computed(() => Object.values(histories.value).some(h => h.length > 0))

function getCount(key) { return histories.value[key]?.length || 0 }
function getTabIcon(key) { return tabs.find(t => t.key === key)?.icon || '' }

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function deleteItem(id) {
  deleteHistoryItem(activeTab.value, id)
  histories.value[activeTab.value] = getHistory(activeTab.value)
}

function confirmClear() {
  clearHistory(HISTORY_TYPES.SALARY)
  clearHistory(HISTORY_TYPES.LOAN)
  clearHistory(HISTORY_TYPES.TAX)
  histories.value = { salary: [], loan: [], tax: [] }
  showClearConfirm.value = false
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
