import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getHistory, HISTORY_TYPES } from '@/utils/storage.js'

export const useAppStore = defineStore('app', () => {
  const isDark = ref(localStorage.getItem('vn-finance-theme') === 'dark')

  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('vn-finance-theme', val ? 'dark' : 'light')
  }, { immediate: true })

  function toggleDark() {
    isDark.value = !isDark.value
  }

  const allHistory = ref({
    salary: getHistory(HISTORY_TYPES.SALARY),
    loan: getHistory(HISTORY_TYPES.LOAN),
    tax: getHistory(HISTORY_TYPES.TAX),
  })

  function refreshAllHistory() {
    allHistory.value = {
      salary: getHistory(HISTORY_TYPES.SALARY),
      loan: getHistory(HISTORY_TYPES.LOAN),
      tax: getHistory(HISTORY_TYPES.TAX),
    }
  }

  return { isDark, toggleDark, allHistory, refreshAllHistory }
})
