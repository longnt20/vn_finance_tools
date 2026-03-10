import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateMonthlyTax, calculateAnnualTax } from '@/utils/taxCalc.js'
import { saveToHistory, getHistory, HISTORY_TYPES } from '@/utils/storage.js'

export const useTaxStore = defineStore('tax', () => {
  const period = ref('monthly') // 'monthly' | 'annual'
  const income = ref(25)
  const dependents = ref(0)
  const hasInsurance = ref(true)
  const otherIncome = ref(0)
  const result = ref(null)
  const history = ref(getHistory(HISTORY_TYPES.TAX))
  const isCalculated = ref(false)

  function calculate() {
    const params = {
      dependents: parseInt(dependents.value),
      hasInsurance: hasInsurance.value,
      otherIncome: parseFloat(otherIncome.value) || 0,
    }

    if (period.value === 'monthly') {
      result.value = calculateMonthlyTax({ income: parseFloat(income.value), ...params })
    } else {
      result.value = calculateAnnualTax({ annualIncome: parseFloat(income.value), ...params })
    }
    isCalculated.value = true
  }

  function saveHistory() {
    if (!result.value) return
    saveToHistory(HISTORY_TYPES.TAX, {
      period: period.value,
      income: income.value,
      dependents: dependents.value,
      hasInsurance: hasInsurance.value,
      otherIncome: otherIncome.value,
      tax: result.value.tax,
      effectiveTaxRate: result.value.effectiveTaxRate,
      label: `${period.value === 'monthly' ? 'Tháng' : 'Năm'}: ${income.value}tr → Thuế: ${result.value.tax.toFixed(2)}tr`,
    })
    history.value = getHistory(HISTORY_TYPES.TAX)
  }

  function reset() {
    income.value = 25
    dependents.value = 0
    hasInsurance.value = true
    otherIncome.value = 0
    result.value = null
    isCalculated.value = false
  }

  function refreshHistory() {
    history.value = getHistory(HISTORY_TYPES.TAX)
  }

  return {
    period, income, dependents, hasInsurance, otherIncome,
    result, history, isCalculated,
    calculate, saveHistory, reset, refreshHistory,
  }
})
