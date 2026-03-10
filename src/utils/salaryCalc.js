/**
 * Salary Calculator - Vietnamese Tax System
 * Based on current Vietnamese labor law and personal income tax regulations
 */

// Insurance rates (employee portion)
export const INSURANCE_RATES = {
  BHXH: 0.08,   // Social Insurance: 8%
  BHYT: 0.015,  // Health Insurance: 1.5%
  BHTN: 0.01,   // Unemployment Insurance: 1%
}

export const TOTAL_INSURANCE_RATE = Object.values(INSURANCE_RATES).reduce((a, b) => a + b, 0) // 10.5%

// Personal deductions (monthly, million VND)
export const PERSONAL_DEDUCTION = 15.5 // 15.5 triệu/tháng
export const DEPENDENT_DEDUCTION = 6.2  // 6.2 triệu/người/tháng

// Progressive tax brackets (monthly income in million VND)
export const TAX_BRACKETS = [
  { min: 0,   max: 10,  rate: 0.05, label: 'Bậc 1' },
  { min: 10,  max: 30,  rate: 0.10, label: 'Bậc 2' },
  { min: 30,  max: 60,  rate: 0.20, label: 'Bậc 3' },
  { min: 60,  max: 100, rate: 0.30, label: 'Bậc 4' },
  { min: 100, max: Infinity, rate: 0.35, label: 'Bậc 5' },
]

/**
 * Calculate progressive income tax
 * @param {number} taxableIncome - Income subject to tax (million VND)
 * @returns {object} - Tax breakdown by bracket
 */
export function calculateProgressiveTax(taxableIncome) {
  if (taxableIncome <= 0) return { total: 0, brackets: [] }

  let remainingIncome = taxableIncome
  let totalTax = 0
  const bracketDetails = []

  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break

    const bracketWidth = bracket.max === Infinity ? remainingIncome : Math.min(bracket.max - bracket.min, remainingIncome)
    const taxableInBracket = Math.min(bracketWidth, remainingIncome)
    const taxInBracket = taxableInBracket * bracket.rate

    if (taxableInBracket > 0) {
      bracketDetails.push({
        ...bracket,
        taxableAmount: taxableInBracket,
        taxAmount: taxInBracket,
        active: true,
      })
      totalTax += taxInBracket
    } else {
      bracketDetails.push({ ...bracket, taxableAmount: 0, taxAmount: 0, active: false })
    }

    remainingIncome -= taxableInBracket
  }

  return { total: totalTax, brackets: bracketDetails }
}

/**
 * Calculate Net from Gross
 * @param {number} gross - Gross salary (million VND)
 * @param {number} dependents - Number of dependents
 * @param {boolean} hasInsurance - Whether employee pays insurance
 */
export function calculateNetFromGross(gross, dependents = 0, hasInsurance = true) {
  const bhxh = hasInsurance ? gross * INSURANCE_RATES.BHXH : 0
  const bhyt = hasInsurance ? gross * INSURANCE_RATES.BHYT : 0
  const bhtn = hasInsurance ? gross * INSURANCE_RATES.BHTN : 0
  const totalInsurance = bhxh + bhyt + bhtn

  const personalDeduction = PERSONAL_DEDUCTION
  const dependentDeductionTotal = dependents * DEPENDENT_DEDUCTION

  const taxableIncome = Math.max(0, gross - totalInsurance - personalDeduction - dependentDeductionTotal)
  const taxResult = calculateProgressiveTax(taxableIncome)
  const tax = taxResult.total

  const net = gross - totalInsurance - tax

  return {
    gross,
    bhxh,
    bhyt,
    bhtn,
    totalInsurance,
    personalDeduction,
    dependentDeductionTotal,
    taxableIncome,
    tax,
    net,
    taxBrackets: taxResult.brackets,
  }
}

/**
 * Calculate Gross from Net (binary search / iterative approach)
 * @param {number} net - Net salary (million VND)
 * @param {number} dependents - Number of dependents
 * @param {boolean} hasInsurance - Whether employee pays insurance
 */
export function calculateGrossFromNet(net, dependents = 0, hasInsurance = true) {
  if (net <= 0) return calculateNetFromGross(0, dependents, hasInsurance)

  // Binary search for gross
  let low = net
  let high = net * 2.5
  let gross = net

  for (let i = 0; i < 100; i++) {
    gross = (low + high) / 2
    const result = calculateNetFromGross(gross, dependents, hasInsurance)
    const diff = result.net - net

    if (Math.abs(diff) < 0.0001) break
    if (diff > 0) high = gross
    else low = gross
  }

  return calculateNetFromGross(gross, dependents, hasInsurance)
}

/**
 * Format currency (VND)
 */
export function formatCurrency(amount, unit = 'triệu') {
  if (unit === 'triệu') {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(amount) + ' triệu'
  }
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount * 1_000_000)) + ' ₫'
}

export function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}
