/**
 * Loan Calculator
 * Supports: Decreasing balance (dư nợ giảm dần) & Annuity (trả góp đều)
 */

export const LOAN_TYPES = {
  DECREASING: 'decreasing',
  ANNUITY: 'annuity',
}

/**
 * Decreasing balance method (Dư nợ giảm dần)
 * Each month: pay fixed principal + decreasing interest
 */
export function calculateDecreasingLoan(principal, annualRate, termMonths) {
  const monthlyRate = annualRate / 100 / 12
  const monthlyPrincipal = principal / termMonths
  const schedule = []
  let totalInterest = 0
  let remainingBalance = principal

  for (let month = 1; month <= termMonths; month++) {
    const interest = remainingBalance * monthlyRate
    const payment = monthlyPrincipal + interest
    totalInterest += interest
    remainingBalance -= monthlyPrincipal

    schedule.push({
      month,
      payment: Math.max(0, payment),
      principal: monthlyPrincipal,
      interest,
      balance: Math.max(0, remainingBalance),
    })
  }

  return {
    type: LOAN_TYPES.DECREASING,
    monthlyPaymentFirst: schedule[0]?.payment || 0,
    monthlyPaymentLast: schedule[schedule.length - 1]?.payment || 0,
    totalInterest,
    totalPayment: principal + totalInterest,
    principal,
    schedule,
  }
}

/**
 * Annuity method (Trả góp đều / Equal installment)
 * Formula: PMT = P * r * (1+r)^n / ((1+r)^n - 1)
 */
export function calculateAnnuityLoan(principal, annualRate, termMonths) {
  const r = annualRate / 100 / 12

  let monthlyPayment
  if (r === 0) {
    monthlyPayment = principal / termMonths
  } else {
    const factor = Math.pow(1 + r, termMonths)
    monthlyPayment = (principal * r * factor) / (factor - 1)
  }

  const schedule = []
  let remainingBalance = principal
  let totalInterest = 0

  for (let month = 1; month <= termMonths; month++) {
    const interest = remainingBalance * r
    const principalPart = monthlyPayment - interest
    totalInterest += interest
    remainingBalance -= principalPart

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPart,
      interest,
      balance: Math.max(0, remainingBalance),
    })
  }

  return {
    type: LOAN_TYPES.ANNUITY,
    monthlyPayment,
    totalInterest,
    totalPayment: monthlyPayment * termMonths,
    principal,
    schedule,
  }
}

/**
 * Main loan calculator with down payment
 */
export function calculateLoan({ totalValue, downPayment, annualRate, termYears, loanType }) {
  const principal = totalValue - downPayment
  const termMonths = termYears * 12

  if (principal <= 0 || termMonths <= 0 || annualRate < 0) {
    return null
  }

  if (loanType === LOAN_TYPES.DECREASING) {
    return calculateDecreasingLoan(principal, annualRate, termMonths)
  } else {
    return calculateAnnuityLoan(principal, annualRate, termMonths)
  }
}

/**
 * Get chart data for loan visualization
 */
export function getLoanChartData(schedule) {
  const labels = schedule.map(s => `T${s.month}`)
  const balanceData = schedule.map(s => s.balance / 1_000_000)
  const interestData = schedule.map(s => s.interest / 1_000_000)
  const principalData = schedule.map(s => s.principal / 1_000_000)

  return { labels, balanceData, interestData, principalData }
}

export function formatMoney(amount) {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(2) + ' tỷ'
  } else if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + ' tr'
  }
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export function formatMoneyFull(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}
