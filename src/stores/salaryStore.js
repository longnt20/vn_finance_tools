import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateNetFromGross, calculateGrossFromNet } from '@/utils/salaryCalc.js'
import { saveToHistory, getHistory, HISTORY_TYPES } from '@/utils/storage.js'

export const useSalaryStore = defineStore('salary', () => {
  // State
  const mode = ref('gross-to-net') // 'gross-to-net' | 'net-to-gross'
  const inputAmount = ref(20)
  const dependents = ref(0)
  const hasInsurance = ref(true)
  const result = ref(null)
  const history = ref(getHistory(HISTORY_TYPES.SALARY))
  const isCalculated = ref(false)

  // Computed
  const chartData = computed(() => {
    if (!result.value) return null
    return {
      labels: ['BHXH', 'BHYT', 'BHTN', 'Thuế TNCN', 'Lương Net'],
      datasets: [{
        data: [
          result.value.bhxh,
          result.value.bhyt,
          result.value.bhtn,
          result.value.tax,
          result.value.net,
        ],
        backgroundColor: [
          '#f97316', // orange - BHXH
          '#eab308', // yellow - BHYT
          '#ec4899', // pink - BHTN
          '#ef4444', // red - Tax
          '#14b8a6', // teal - Net
        ],
        borderWidth: 0,
        hoverOffset: 8,
      }],
    }
  })

  // Actions
  function calculate() {
    const amount = parseFloat(inputAmount.value)
    if (isNaN(amount) || amount <= 0) return

    if (mode.value === 'gross-to-net') {
      result.value = calculateNetFromGross(amount, dependents.value, hasInsurance.value)
    } else {
      result.value = calculateGrossFromNet(amount, dependents.value, hasInsurance.value)
    }
    isCalculated.value = true
  }

  function saveHistory() {
    if (!result.value) return
    const entry = saveToHistory(HISTORY_TYPES.SALARY, {
      mode: mode.value,
      inputAmount: inputAmount.value,
      dependents: dependents.value,
      hasInsurance: hasInsurance.value,
      gross: result.value.gross,
      net: result.value.net,
      tax: result.value.tax,
      label: `Gross: ${result.value.gross.toFixed(1)}tr → Net: ${result.value.net.toFixed(1)}tr`,
    })
    history.value = getHistory(HISTORY_TYPES.SALARY)
    return entry
  }

  function loadFromHistory(item) {
    mode.value = item.mode
    inputAmount.value = item.inputAmount
    dependents.value = item.dependents
    hasInsurance.value = item.hasInsurance
    calculate()
  }

  function reset() {
    inputAmount.value = 20
    dependents.value = 0
    hasInsurance.value = true
    result.value = null
    isCalculated.value = false
  }

  function refreshHistory() {
    history.value = getHistory(HISTORY_TYPES.SALARY)
  }

  return {
    mode, inputAmount, dependents, hasInsurance,
    result, history, isCalculated, chartData,
    calculate, saveHistory, loadFromHistory, reset, refreshHistory,
  }
})
