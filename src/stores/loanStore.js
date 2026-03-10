import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { calculateLoan, getLoanChartData, LOAN_TYPES } from '@/utils/loanCalc.js'
import { saveToHistory, getHistory, HISTORY_TYPES } from '@/utils/storage.js'

export const useLoanStore = defineStore('loan', () => {
  const totalValue = ref(3000) // million VND
  const downPayment = ref(600)
  const annualRate = ref(9)
  const termYears = ref(20)
  const loanType = ref(LOAN_TYPES.ANNUITY)
  const result = ref(null)
  const history = ref(getHistory(HISTORY_TYPES.LOAN))
  const isCalculated = ref(false)

  const chartData = computed(() => {
    if (!result.value || !result.value.schedule) return null
    // Sample every Nth month for performance
    const schedule = result.value.schedule
    const step = Math.max(1, Math.floor(schedule.length / 60))
    const sampled = schedule.filter((_, i) => i % step === 0 || i === schedule.length - 1)

    return {
      labels: sampled.map(s => `T${s.month}`),
      datasets: [
        {
          label: 'Dư nợ (triệu)',
          data: sampled.map(s => s.balance / 1_000_000),
          borderColor: '#14b8a6',
          backgroundColor: 'rgba(20,184,166,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Tiền lãi (triệu)',
          data: sampled.map(s => s.interest / 1_000_000),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.05)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Tiền gốc (triệu)',
          data: sampled.map(s => s.principal / 1_000_000),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139,92,246,0.05)',
          fill: false,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    }
  })

  function calculate() {
    const params = {
      totalValue: parseFloat(totalValue.value) * 1_000_000,
      downPayment: parseFloat(downPayment.value) * 1_000_000,
      annualRate: parseFloat(annualRate.value),
      termYears: parseInt(termYears.value),
      loanType: loanType.value,
    }

    result.value = calculateLoan(params)
    isCalculated.value = true
  }

  function saveHistory() {
    if (!result.value) return
    const monthly = loanType.value === LOAN_TYPES.ANNUITY
      ? result.value.monthlyPayment
      : result.value.monthlyPaymentFirst

    saveToHistory(HISTORY_TYPES.LOAN, {
      totalValue: totalValue.value,
      downPayment: downPayment.value,
      annualRate: annualRate.value,
      termYears: termYears.value,
      loanType: loanType.value,
      monthlyPayment: monthly / 1_000_000,
      totalInterest: result.value.totalInterest / 1_000_000,
      label: `Vay ${(totalValue.value - downPayment.value).toFixed(0)}tr | ${termYears.value} năm | ${annualRate.value}%`,
    })
    history.value = getHistory(HISTORY_TYPES.LOAN)
  }

  function reset() {
    totalValue.value = 3000
    downPayment.value = 600
    annualRate.value = 9
    termYears.value = 20
    loanType.value = LOAN_TYPES.ANNUITY
    result.value = null
    isCalculated.value = false
  }

  function refreshHistory() {
    history.value = getHistory(HISTORY_TYPES.LOAN)
  }

  return {
    totalValue, downPayment, annualRate, termYears, loanType,
    result, history, isCalculated, chartData,
    calculate, saveHistory, reset, refreshHistory,
  }
})
