/**
 * Personal Income Tax (Thuế TNCN) Calculator
 * Based on Vietnamese tax law (Law No. 04/2007/QH12 and amendments)
 */

import { PERSONAL_DEDUCTION, DEPENDENT_DEDUCTION, INSURANCE_RATES, calculateProgressiveTax } from './salaryCalc.js'

export { TAX_BRACKETS } from './salaryCalc.js'

/**
 * Calculate TNCN for monthly income
 */
export function calculateMonthlyTax({
  income,          // Total gross income (triệu VND)
  dependents = 0,
  hasInsurance = true,
  otherIncome = 0, // Other taxable income (triệu VND)
}) {
  const totalGrossIncome = income + otherIncome

  // Insurance deductions
  const bhxh = hasInsurance ? income * INSURANCE_RATES.BHXH : 0
  const bhyt = hasInsurance ? income * INSURANCE_RATES.BHYT : 0
  const bhtn = hasInsurance ? income * INSURANCE_RATES.BHTN : 0
  const totalInsurance = bhxh + bhyt + bhtn

  // Taxable income (Thu nhập chịu thuế)
  const taxableSubjectIncome = totalGrossIncome - totalInsurance

  // Tax deductions (Giảm trừ)
  const personalDeduction = PERSONAL_DEDUCTION
  const dependentDeductionTotal = dependents * DEPENDENT_DEDUCTION

  // Income subject to tax calculation (Thu nhập tính thuế)
  const taxCalculationIncome = Math.max(
    0,
    taxableSubjectIncome - personalDeduction - dependentDeductionTotal
  )

  // Progressive tax
  const taxResult = calculateProgressiveTax(taxCalculationIncome)

  return {
    period: 'monthly',
    totalGrossIncome,
    bhxh,
    bhyt,
    bhtn,
    totalInsurance,
    taxableSubjectIncome,
    personalDeduction,
    dependentDeductionTotal,
    totalDeductions: personalDeduction + dependentDeductionTotal,
    taxCalculationIncome,
    tax: taxResult.total,
    netIncome: totalGrossIncome - totalInsurance - taxResult.total,
    taxBrackets: taxResult.brackets,
    effectiveTaxRate: taxCalculationIncome > 0 ? (taxResult.total / totalGrossIncome) * 100 : 0,
  }
}

/**
 * Calculate TNCN for annual income
 */
export function calculateAnnualTax({
  annualIncome,
  dependents = 0,
  hasInsurance = true,
  otherIncome = 0,
}) {
  // Convert to monthly equivalent for calculation
  const monthlyIncome = annualIncome / 12
  const monthlyOther = otherIncome / 12

  const monthly = calculateMonthlyTax({
    income: monthlyIncome,
    dependents,
    hasInsurance,
    otherIncome: monthlyOther,
  })

  return {
    ...monthly,
    period: 'annual',
    totalGrossIncome: monthly.totalGrossIncome * 12,
    bhxh: monthly.bhxh * 12,
    bhyt: monthly.bhyt * 12,
    bhtn: monthly.bhtn * 12,
    totalInsurance: monthly.totalInsurance * 12,
    taxableSubjectIncome: monthly.taxableSubjectIncome * 12,
    personalDeduction: monthly.personalDeduction * 12,
    dependentDeductionTotal: monthly.dependentDeductionTotal * 12,
    totalDeductions: monthly.totalDeductions * 12,
    taxCalculationIncome: monthly.taxCalculationIncome * 12,
    tax: monthly.tax * 12,
    netIncome: monthly.netIncome * 12,
  }
}
