<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">📊 Tính Thuế TNCN</h1>
      <p class="page-subtitle">Thuế thu nhập cá nhân theo Luật thuế TNCN Việt Nam hiện hành</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Input -->
      <div class="space-y-5">
        <!-- Period Toggle -->
        <div class="card p-1.5">
          <div class="grid grid-cols-2 gap-1">
            <button
              @click="store.period = 'monthly'"
              :class="[
                'py-2.5 px-4 rounded-xl text-sm font-semibold transition-all',
                store.period === 'monthly' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
              ]"
            >📅 Theo tháng</button>
            <button
              @click="store.period = 'annual'"
              :class="[
                'py-2.5 px-4 rounded-xl text-sm font-semibold transition-all',
                store.period === 'annual' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
              ]"
            >📆 Theo năm</button>
          </div>
        </div>

        <div class="card p-6 space-y-4">
          <div>
            <label class="label-text">
              {{ store.period === 'monthly' ? 'Thu nhập tháng' : 'Thu nhập năm' }}
              <span class="text-brand-500 font-normal">(triệu VND)</span>
            </label>
            <input
              v-model.number="store.income"
              type="number" min="0" step="0.5"
              class="input-field"
              :placeholder="store.period === 'monthly' ? 'VD: 25' : 'VD: 300'"
            />
          </div>

          <div>
            <label class="label-text">Thu nhập khác <span class="text-slate-400 font-normal">(nếu có, triệu/tháng)</span></label>
            <input v-model.number="store.otherIncome" type="number" min="0" step="0.5" class="input-field" placeholder="0" />
          </div>

          <div>
            <label class="label-text">Số người phụ thuộc</label>
            <div class="flex items-center gap-3">
              <button @click="store.dependents = Math.max(0, store.dependents - 1)"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-lg font-bold transition-colors flex items-center justify-center">−</button>
              <div class="flex-1 text-center">
                <span class="text-2xl font-bold font-mono">{{ store.dependents }}</span>
                <div class="text-xs text-slate-400 mt-0.5">−{{ (store.dependents * 6.2).toFixed(1) }}tr/tháng</div>
              </div>
              <button @click="store.dependents = Math.min(10, store.dependents + 1)"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-lg font-bold transition-colors flex items-center justify-center">+</button>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <div class="text-sm font-medium text-slate-700 dark:text-slate-300">Đóng bảo hiểm</div>
              <div class="text-xs text-slate-400">Được trừ trước khi tính thuế</div>
            </div>
            <button
              @click="store.hasInsurance = !store.hasInsurance"
              :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', store.hasInsurance ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600']"
            >
              <span :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform', store.hasInsurance ? 'translate-x-6' : 'translate-x-1']"></span>
            </button>
          </div>

          <div class="flex gap-3 pt-1">
            <button @click="calculate" class="flex-1 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all shadow-sm">
              🔍 Tính thuế
            </button>
            <button @click="store.reset()" class="btn-secondary px-4">↺</button>
          </div>
        </div>

        <!-- Tax Bracket Table -->
        <div class="card p-5">
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Biểu thuế lũy tiến (tháng)</h3>
          <div class="overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
            <table class="w-full text-xs">
              <thead class="bg-slate-50 dark:bg-slate-800">
                <tr class="text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th class="px-3 py-2 text-left">Bậc</th>
                  <th class="px-3 py-2 text-left">Thu nhập tính thuế</th>
                  <th class="px-3 py-2 text-right">Thuế</th>
                  <th class="px-3 py-2 text-right">Nộp</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr
                  v-for="bracket in activeBrackets"
                  :key="bracket.label"
                  :class="[
                    'transition-colors',
                    bracket.highlighted
                      ? 'bg-orange-50 dark:bg-orange-950/30 font-semibold text-orange-700 dark:text-orange-300'
                      : 'text-slate-600 dark:text-slate-400'
                  ]"
                >
                  <td class="px-3 py-2">{{ bracket.label }}</td>
                  <td class="px-3 py-2 font-mono">{{ formatBracketRange(bracket) }}</td>
                  <td class="px-3 py-2 text-right font-mono">{{ (bracket.rate * 100).toFixed(0) }}%</td>
                  <td class="px-3 py-2 text-right font-mono">
                    <template v-if="bracket.taxAmount > 0">
                      {{ bracket.taxAmount.toFixed(2) }}tr
                    </template>
                    <template v-else>—</template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-5">
        <Transition name="result" mode="out-in">
          <div v-if="store.result" class="space-y-5">
            <!-- Main Tax Card -->
            <div class="card p-6 bg-gradient-to-br from-orange-50 to-amber-50/50 dark:from-orange-950/30 dark:to-slate-900 border-orange-200 dark:border-orange-900/50">
              <div class="flex items-center justify-between mb-4">
                <span class="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  Thuế phải nộp {{ store.period === 'monthly' ? '/ tháng' : '/ năm' }}
                </span>
                <span class="tag bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 text-xs px-2.5 py-1 rounded-full font-medium">
                  ≈ {{ store.result.effectiveTaxRate.toFixed(1) }}% thu nhập
                </span>
              </div>
              <div class="text-4xl font-bold font-mono text-orange-600 dark:text-orange-400">
                {{ store.result.tax.toFixed(3) }}<span class="text-lg font-normal text-orange-400 ml-1">triệu</span>
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                ≈ {{ new Intl.NumberFormat('vi-VN').format(Math.round(store.result.tax * 1_000_000)) }} đồng
              </div>
            </div>

            <!-- Calculation Breakdown -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Chi tiết tính thuế</h3>
              <div class="space-y-2">
                <TaxRow label="Tổng thu nhập" :value="store.result.totalGrossIncome" is-gross />
                <TaxRow label="- Bảo hiểm" :value="store.result.totalInsurance" is-deduction />
                <div class="ml-4 space-y-1 text-xs text-slate-400 font-mono py-1">
                  <div class="flex justify-between"><span>BHXH (8%)</span><span>{{ store.result.bhxh.toFixed(3) }}tr</span></div>
                  <div class="flex justify-between"><span>BHYT (1.5%)</span><span>{{ store.result.bhyt.toFixed(3) }}tr</span></div>
                  <div class="flex justify-between"><span>BHTN (1%)</span><span>{{ store.result.bhtn.toFixed(3) }}tr</span></div>
                </div>
                <TaxRow label="= Thu nhập chịu thuế" :value="store.result.taxableSubjectIncome" is-subtotal />
                <TaxRow label="- Giảm trừ bản thân" :value="store.result.personalDeduction" is-deduction />
                <TaxRow label="- Giảm trừ phụ thuộc" :value="store.result.dependentDeductionTotal" is-deduction />
                <div class="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <TaxRow label="= Thu nhập tính thuế" :value="store.result.taxCalculationIncome" is-subtotal highlight />
                <div class="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <TaxRow label="Thuế TNCN phải nộp" :value="store.result.tax" is-tax />
                <div class="border-t-2 border-slate-200 dark:border-slate-700 my-1"></div>
                <TaxRow label="✅ Thu nhập thực nhận" :value="store.result.netIncome" is-net />
              </div>
            </div>

            <!-- Save -->
            <button @click="handleSave" class="btn-secondary w-full text-sm">💾 Lưu vào lịch sử</button>
          </div>

          <div v-else class="card p-12 text-center">
            <div class="text-4xl mb-3">📊</div>
            <div class="text-slate-500 dark:text-slate-400 text-sm">Nhập thu nhập và nhấn "Tính thuế"</div>
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
import { useTaxStore } from '@/stores/taxStore.js'
import { TAX_BRACKETS } from '@/utils/taxCalc.js'
import TaxRow from '@/components/Tax/TaxRow.vue'

const store = useTaxStore()
const notification = ref('')

const activeBrackets = computed(() => {
  return TAX_BRACKETS.map(bracket => {
    const resultBracket = store.result?.taxBrackets?.find(b => b.label === bracket.label)
    return {
      ...bracket,
      taxAmount: resultBracket?.taxAmount || 0,
      highlighted: resultBracket?.active && resultBracket?.taxAmount > 0,
    }
  })
})

function formatBracketRange(bracket) {
  if (bracket.max === Infinity) return `> ${bracket.min}tr`
  return `${bracket.min}–${bracket.max}tr`
}

function calculate() { store.calculate() }

function showNotification(msg) {
  notification.value = msg
  setTimeout(() => { notification.value = '' }, 2500)
}

function handleSave() {
  store.saveHistory()
  showNotification('✅ Đã lưu!')
}
</script>

<style scoped>
.result-enter-active, .result-leave-active { transition: opacity 0.2s, transform 0.2s; }
.result-enter-from, .result-leave-to { opacity: 0; transform: translateY(8px); }
.toast-enter-active, .toast-leave-active { transition: opacity 0.2s, transform 0.2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(8px); }
</style>
