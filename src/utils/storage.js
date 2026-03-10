/**
 * Storage utility using localStorage with IndexedDB fallback
 */

const DB_NAME = 'vn-finance-tools'
const DB_VERSION = 1
const STORES = {
  SALARY: 'salary-history',
  LOAN: 'loan-history',
  TAX: 'tax-history',
}

// Simple localStorage wrapper for history
export function saveToHistory(type, data) {
  try {
    const key = `vn-finance-${type}`
    const existing = getHistory(type)
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...data,
    }
    const updated = [newEntry, ...existing].slice(0, 50) // Keep last 50
    localStorage.setItem(key, JSON.stringify(updated))
    return newEntry
  } catch (e) {
    console.error('Failed to save history:', e)
    return null
  }
}

export function getHistory(type) {
  try {
    const key = `vn-finance-${type}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch (e) {
    return []
  }
}

export function clearHistory(type) {
  try {
    localStorage.removeItem(`vn-finance-${type}`)
  } catch (e) {
    console.error('Failed to clear history:', e)
  }
}

export function deleteHistoryItem(type, id) {
  try {
    const history = getHistory(type)
    const updated = history.filter(item => item.id !== id)
    localStorage.setItem(`vn-finance-${type}`, JSON.stringify(updated))
  } catch (e) {
    console.error('Failed to delete item:', e)
  }
}

export const HISTORY_TYPES = {
  SALARY: 'salary',
  LOAN: 'loan',
  TAX: 'tax',
}
