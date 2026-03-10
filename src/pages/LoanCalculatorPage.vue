<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">🏠 Tính Vay Mua Nhà / Xe</h1>
      <p class="page-subtitle">Tính toán khoản vay theo phương pháp dư nợ giảm dần hoặc trả góp đều</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Input Panel -->
      <div class="space-y-5">
        <!-- Loan Type -->
        <div class="card p-1.5">
          <div class="grid grid-cols-2 gap-1">
            <button
              @click="store.loanType = LOAN_TYPES.ANNUITY"
              :class="[
                'py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 text-center',
                store.loanType === LOAN_TYPES.ANNUITY
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              ]"
            >
              📅 Trả Góp Đều
            </button>
            <button
              @click="store.loanType = LOAN_TYPES.DECREASING"
              :class="[
                'py-2.5 px-4 rounded-xl text-xs font-semibold transition-all duration-200 text-center',
                store.loanType === LOAN_TYPES.DECREASING
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              ]"
            >
              📉 Dư Nợ Giảm Dần
            </button>
          </div>
        </div>

        <!-- Method explanation -->
        <div class="px-4 py-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/50 rounded-xl text-xs text-purple-700 dark:text-purple-300">
          <template v-if="store.loanType === LOAN_TYPES.ANNUITY">
            <strong>Trả góp đều:</strong> Mỗi tháng trả cùng một số tiền cố định, trong đó tỷ lệ gốc tăng dần, lãi giảm dần theo thời gian.
          </template>
          <template v-else>
            <strong>Dư nợ giảm dần:</strong> Tiền gốc cố định mỗi tháng, tiền lãi giảm dần vì dư nợ giảm. Tổng tiền trả tháng đầu cao nhất.
          </template>
        </div>

        <!-- Input Fields -->
        <div class="card p-6 space-y-4">
          <div>
            <label class="label-text">Giá trị tài sản <span class="text-brand-500 font-normal">(triệu VND)</span></label>
            <input v-model.number="store.totalValue" type="number" min="0" step="100" class="input-field" placeholder="3000" />
          </div>
          <div>
            <label class="label-text">Trả trước <span class="text-brand-500 font-normal">(triệu VND)</span></label>
            <input v-model.number="store.downPayment" type="number" min="0" class="input-field" placeholder="600" />
            <div class="text-xs text-slate-400 mt-1 font-mono">
              Vay: {{ Math.max(0, (store.totalValue - store.downPayment)).toFixed(0) }}tr
              ({{ store.totalValue > 0 ? ((1 - store.downPayment / store.totalValue) * 100).toFixed(0) : 0 }}%)
            </div>
          </div>
          <div>
            <label class="label-text">Lãi suất <span class="text-brand-500 font-normal">(%/năm)</span></label>
            <div class="relative">
              <input v-model.number="store.annualRate" type="number" min="0" max="30" step="0.1" class="input-field pr-10" placeholder="9" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
            <!-- Rate presets -->
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                v-for="rate in [6.5, 7.5, 8, 9, 10, 11, 12]"
                :key="rate"
                @click="store.annualRate = rate"
                :class="[
                  'text-xs px-2 py-0.5 rounded-lg font-mono transition-colors',
                  store.annualRate === rate
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 hover:text-purple-600 dark:hover:text-purple-400'
                ]"
              >{{ rate }}%</button>
            </div>
          </div>
          <div>
            <label class="label-text">Số năm vay</label>
            <div class="relative">
              <input v-model.number="store.termYears" type="number" min="1" max="30" class="input-field pr-14" placeholder="20" />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">năm</span>
            </div>
            <!-- Term presets -->
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                v-for="year in [5, 10, 15, 20, 25, 30]"
                :key="year"
                @click="store.termYears = year"
                :class="[
                  'text-xs px-2 py-0.5 rounded-lg font-mono transition-colors',
                  store.termYears === year
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                ]"
              >{{ year }}y</button>
            </div>
          </div>

          <div class="flex gap-3 pt-1">
            <button @click="calculate" class="flex-1 py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all shadow-sm">
              🔍 Tính toán
            </button>
            <button @click="store.reset()" class="btn-secondary px-4">↺</button>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-5">
        <Transition name="result" mode="out-in">
          <div v-if="store.result" class="space-y-5">
            <!-- Summary Cards -->
            <div class="grid grid-cols-2 gap-3">
              <div class="stat-card border-purple-100 dark:border-purple-900/50">
                <div class="stat-label text-purple-600 dark:text-purple-400">Trả hàng tháng</div>
                <div class="stat-value text-purple-700 dark:text-purple-300 text-xl">
                  {{ formatMoney(monthlyPayment) }}
                </div>
                <div v-if="store.loanType === LOAN_TYPES.DECREASING" class="text-xs text-slate-400 font-mono">
                  → {{ formatMoney(store.result.monthlyPaymentLast) }}
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Tổng lãi</div>
                <div class="stat-value text-red-500">{{ formatMoney(store.result.totalInterest) }}</div>
                <div class="text-xs text-slate-400 font-mono">
                  {{ ((store.result.totalInterest / store.result.principal) * 100).toFixed(1) }}% vốn
                </div>
              </div>
              <div class="stat-card col-span-2">
                <div class="stat-label">Tổng tiền phải trả</div>
                <div class="stat-value text-lg">{{ formatMoney(store.result.totalPayment) }}</div>
                <div class="text-xs text-slate-400 mt-1">
                  <span class="font-mono">Gốc: {{ formatMoney(store.result.principal) }}</span>
                  <span class="mx-2 text-slate-300 dark:text-slate-600">+</span>
                  <span class="font-mono text-red-400">Lãi: {{ formatMoney(store.result.totalInterest) }}</span>
                </div>
              </div>
            </div>

            <!-- Chart -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Biểu đồ dư nợ & thanh toán</h3>
              <LoanLineChart :chart-data="store.chartData" />
            </div>

            <!-- Payment Schedule Preview -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                Lịch trả nợ chi tiết
                <span class="text-xs font-normal text-slate-400">{{ store.result.schedule.length }} tháng</span>
              </h3>
              <div class="overflow-auto max-h-64 -mx-1 px-1">
                <table class="w-full text-xs">
                  <thead class="sticky top-0 bg-white dark:bg-slate-900">
                    <tr class="text-slate-400 uppercase tracking-wider">
                      <th class="pb-2 text-left font-medium">Tháng</th>
                      <th class="pb-2 text-right font-medium">Trả</th>
                      <th class="pb-2 text-right font-medium">Gốc</th>
                      <th class="pb-2 text-right font-medium">Lãi</th>
                      <th class="pb-2 text-right font-medium">Dư nợ</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr
                      v-for="row in previewSchedule"
                      :key="row.month"
                      class="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td class="py-1.5 font-mono">T{{ row.month }}</td>
                      <td class="py-1.5 text-right font-mono font-medium">{{ formatMoney(row.payment) }}</td>
                      <td class="py-1.5 text-right font-mono text-purple-600 dark:text-purple-400">{{ formatMoney(row.principal) }}</td>
                      <td class="py-1.5 text-right font-mono text-red-500">{{ formatMoney(row.interest) }}</td>
                      <td class="py-1.5 text-right font-mono text-slate-500">{{ formatMoney(row.balance) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Save -->
            <button @click="handleSave" class="btn-secondary w-full text-sm">💾 Lưu vào lịch sử</button>
          </div>

          <div v-else class="card p-12 text-center">
            <div class="text-4xl mb-3">🏦</div>
            <div class="text-slate-500 dark:text-slate-400 text-sm">Nhập thông tin vay và nhấn "Tính toán"</div>
          </div>
        </Transition>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="notification" class="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
        {{ notification }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLoanStore } from '@/stores/loanStore.js'
import { LOAN_TYPES } from '@/utils/loanCalc.js'
import LoanLineChart from '@/components/Loan/LoanLineChart.vue'

const store = useLoanStore()
const notification = ref('')

const monthlyPayment = computed(() => {
  if (!store.result) return 0
  return store.loanType === LOAN_TYPES.ANNUITY
    ? store.result.monthlyPayment
    : store.result.monthlyPaymentFirst
})

const previewSchedule = computed(() => {
  if (!store.result?.schedule) return []
  const s = store.result.schedule
  // Show first 3, a gap, and last 3 for large schedules
  if (s.length <= 24) return s
  return [
    ...s.slice(0, 12),
    { month: '...', payment: null, principal: null, interest: null, balance: null },
    ...s.slice(-6),
  ]
})

function formatMoney(amount) {
  if (amount === null) return '...'
  if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(2) + 'B'
  if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + 'M'
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount))
}

function calculate() {
  store.calculate()
}

function showNotification(msg) {
  notification.value = msg
  setTimeout(() => { notification.value = '' }, 2500)
}

function handleSave() {
  store.saveHistory()
  showNotification('✅ Đã lưu vào lịch sử!')
}
</script>

<style scoped>
.result-enter-active, .result-leave-active { transition: opacity 0.2s, transform 0.2s; }
.result-enter-from, .result-leave-to { opacity: 0; transform: translateY(8px); }
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
