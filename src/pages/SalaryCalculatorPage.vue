<template>
  <div class="animate-fade-in">
    <div class="page-header">
      <h1 class="page-title">💰 Tính Lương Gross ↔ Net</h1>
      <p class="page-subtitle">Tính toán lương theo hệ thống thuế Việt Nam, có bảo hiểm và thuế TNCN lũy tiến</p>
    </div>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Input Panel -->
      <div class="space-y-5">
        <!-- Mode Toggle -->
        <div class="card p-1.5">
          <div class="grid grid-cols-2 gap-1">
            <button
              @click="store.mode = 'gross-to-net'"
              :class="[
                'py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200',
                store.mode === 'gross-to-net'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              ]"
            >
              Gross → Net
            </button>
            <button
              @click="store.mode = 'net-to-gross'"
              :class="[
                'py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200',
                store.mode === 'net-to-gross'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              ]"
            >
              Net → Gross
            </button>
          </div>
        </div>

        <!-- Input Card -->
        <div class="card p-6 space-y-5">
          <!-- Salary Input -->
          <div>
            <label class="label-text">
              {{ store.mode === 'gross-to-net' ? 'Lương Gross' : 'Lương Net' }}
              <span class="text-brand-500 font-normal">(triệu VND/tháng)</span>
            </label>
            <div class="relative">
              <input
                v-model.number="store.inputAmount"
                type="number"
                min="0"
                step="0.5"
                class="input-field pr-20"
                :placeholder="store.mode === 'gross-to-net' ? 'Nhập lương Gross...' : 'Nhập lương Net...'"
                @keyup.enter="calculate"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                triệu
              </span>
            </div>
            <!-- Quick values -->
            <div class="flex flex-wrap gap-1.5 mt-2">
              <button
                v-for="v in quickValues"
                :key="v"
                @click="store.inputAmount = v; calculate()"
                class="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-400 text-slate-500 dark:text-slate-400 rounded-lg transition-colors font-mono"
              >{{ v }}tr</button>
            </div>
          </div>

          <!-- Dependents -->
          <div>
            <label class="label-text">Số người phụ thuộc</label>
            <div class="flex items-center gap-3">
              <button
                @click="store.dependents = Math.max(0, store.dependents - 1)"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg transition-colors flex items-center justify-center"
              >−</button>
              <div class="flex-1 text-center">
                <span class="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">{{ store.dependents }}</span>
                <div class="text-xs text-slate-400 mt-0.5">người (−{{ (store.dependents * 6.2).toFixed(1) }}tr/tháng)</div>
              </div>
              <button
                @click="store.dependents = Math.min(10, store.dependents + 1)"
                class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-lg transition-colors flex items-center justify-center"
              >+</button>
            </div>
          </div>

          <!-- Insurance Toggle -->
          <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <div class="text-sm font-medium text-slate-700 dark:text-slate-300">Đóng bảo hiểm</div>
              <div class="text-xs text-slate-400 mt-0.5">BHXH 8% + BHYT 1.5% + BHTN 1%</div>
            </div>
            <button
              @click="store.hasInsurance = !store.hasInsurance"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none',
                store.hasInsurance ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200',
                  store.hasInsurance ? 'translate-x-6' : 'translate-x-1'
                ]"
              ></span>
            </button>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button @click="calculate" class="btn-primary flex-1">
              🔍 Tính toán
            </button>
            <button @click="store.reset()" class="btn-secondary px-4">
              ↺
            </button>
          </div>
        </div>

        <!-- Tax Brackets Reference -->
        <div class="card p-5">
          <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">📋 Biểu thuế lũy tiến</h3>
          <div class="space-y-1">
            <div
              v-for="bracket in TAX_BRACKETS"
              :key="bracket.label"
              :class="[
                'flex items-center justify-between text-xs py-1.5 px-3 rounded-lg transition-colors',
                isActiveBracket(bracket)
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-semibold border border-brand-200 dark:border-brand-800'
                  : 'text-slate-500 dark:text-slate-400'
              ]"
            >
              <span class="font-medium">{{ bracket.label }}</span>
              <span class="font-mono">{{ formatBracketRange(bracket) }}</span>
              <span :class="isActiveBracket(bracket) ? 'text-brand-600 dark:text-brand-400 font-bold' : ''">
                {{ (bracket.rate * 100).toFixed(0) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Panel -->
      <div class="space-y-5">
        <!-- Main Result -->
        <Transition name="result" mode="out-in">
          <div v-if="store.result" class="space-y-5">
            <!-- Key Numbers -->
            <div class="card p-6 bg-gradient-to-br from-brand-50 to-teal-50/50 dark:from-brand-950/30 dark:to-slate-900 border-brand-200 dark:border-brand-900">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Lương Gross</div>
                  <div class="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
                    {{ store.result.gross.toFixed(2) }}<span class="text-sm font-normal text-slate-400 ml-1">tr</span>
                  </div>
                </div>
                <div>
                  <div class="text-xs font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Lương Net</div>
                  <div class="text-2xl font-bold font-mono text-brand-600 dark:text-brand-400">
                    {{ store.result.net.toFixed(2) }}<span class="text-sm font-normal text-brand-400 ml-1">tr</span>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-brand-200/50 dark:border-brand-800/50">
                <div class="text-xs text-slate-500 dark:text-slate-400">
                  Tỷ lệ Net/Gross: <span class="font-mono font-semibold text-slate-700 dark:text-slate-300">{{ ((store.result.net / store.result.gross) * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>

            <!-- Breakdown -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Chi tiết khấu trừ</h3>
              <div class="space-y-3">
                <BreakdownRow
                  label="BHXH (8%)"
                  :amount="store.result.bhxh"
                  :percentage="store.result.gross > 0 ? (store.result.bhxh / store.result.gross) * 100 : 0"
                  color="bg-orange-400"
                  type="deduction"
                />
                <BreakdownRow
                  label="BHYT (1.5%)"
                  :amount="store.result.bhyt"
                  :percentage="store.result.gross > 0 ? (store.result.bhyt / store.result.gross) * 100 : 0"
                  color="bg-yellow-400"
                  type="deduction"
                />
                <BreakdownRow
                  label="BHTN (1%)"
                  :amount="store.result.bhtn"
                  :percentage="store.result.gross > 0 ? (store.result.bhtn / store.result.gross) * 100 : 0"
                  color="bg-pink-400"
                  type="deduction"
                />
                <div class="border-t border-slate-100 dark:border-slate-800 pt-2"></div>
                <div class="text-xs text-slate-400 px-1">
                  Giảm trừ: Bản thân 15.5tr + Phụ thuộc {{ (store.result.dependentDeductionTotal || 0).toFixed(1) }}tr
                  = Thu nhập tính thuế: <span class="font-mono font-semibold text-slate-600 dark:text-slate-300">{{ store.result.taxableIncome.toFixed(2) }}tr</span>
                </div>
                <BreakdownRow
                  label="Thuế TNCN"
                  :amount="store.result.tax"
                  :percentage="store.result.gross > 0 ? (store.result.tax / store.result.gross) * 100 : 0"
                  color="bg-red-500"
                  type="deduction"
                />
                <div class="border-t border-slate-200 dark:border-slate-700 pt-3 mt-1">
                  <BreakdownRow
                    label="✅ Lương Net"
                    :amount="store.result.net"
                    :percentage="store.result.gross > 0 ? (store.result.net / store.result.gross) * 100 : 0"
                    color="bg-brand-500"
                    type="income"
                    :is-total="true"
                  />
                </div>
              </div>
            </div>

            <!-- Pie Chart -->
            <div class="card p-5">
              <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">Phân bổ lương</h3>
              <SalaryPieChart :chart-data="store.chartData" />
            </div>

            <!-- Save & Export Actions -->
            <div class="flex gap-3">
              <button @click="handleSave" class="btn-secondary flex-1 text-sm">
                💾 Lưu lịch sử
              </button>
              <button @click="handleExportPDF" class="btn-secondary flex-1 text-sm">
                📄 Xuất PDF
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="card p-12 text-center">
            <div class="text-4xl mb-3">💰</div>
            <div class="text-slate-500 dark:text-slate-400 text-sm">Nhập lương và nhấn "Tính toán" để xem kết quả</div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Notification -->
    <Transition name="toast">
      <div
        v-if="notification"
        class="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl text-sm font-medium"
      >
        {{ notification }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSalaryStore } from '@/stores/salaryStore.js'
import { TAX_BRACKETS } from '@/utils/salaryCalc.js'
import BreakdownRow from '@/components/Common/BreakdownRow.vue'
import SalaryPieChart from '@/components/Salary/SalaryPieChart.vue'

const store = useSalaryStore()
const notification = ref('')
const quickValues = [10, 15, 20, 25, 30, 40, 50, 70, 100]

function calculate() {
  store.calculate()
}

function isActiveBracket(bracket) {
  if (!store.result) return false
  return store.result.taxBrackets?.some(b => b.label === bracket.label && b.active)
}

function formatBracketRange(bracket) {
  if (bracket.max === Infinity) return `> ${bracket.min}tr`
  return `${bracket.min}–${bracket.max}tr`
}

function showNotification(msg) {
  notification.value = msg
  setTimeout(() => { notification.value = '' }, 2500)
}

function handleSave() {
  store.saveHistory()
  showNotification('✅ Đã lưu vào lịch sử!')
}

function handleExportPDF() {
  if (!store.result) return
  // Dynamic import for PDF generation
  import('jspdf').then(({ jsPDF }) => {
    import('jspdf-autotable').then(() => {
      const doc = new jsPDF()
      const r = store.result

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('BANG TINH LUONG', 20, 20)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Ngay tinh: ${new Date().toLocaleDateString('vi-VN')}`, 20, 30)

      const rows = [
        ['Luong Gross', `${r.gross.toFixed(3)} trieu VND`],
        ['BHXH (8%)', `- ${r.bhxh.toFixed(3)} trieu VND`],
        ['BHYT (1.5%)', `- ${r.bhyt.toFixed(3)} trieu VND`],
        ['BHTN (1%)', `- ${r.bhtn.toFixed(3)} trieu VND`],
        ['Thue TNCN', `- ${r.tax.toFixed(3)} trieu VND`],
        ['LUONG NET', `${r.net.toFixed(3)} trieu VND`],
      ]

      doc.autoTable({
        head: [['Khoan muc', 'So tien']],
        body: rows,
        startY: 40,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [20, 184, 166] },
        alternateRowStyles: { fillColor: [245, 255, 250] },
      })

      doc.save('bang-tinh-luong.pdf')
      showNotification('📄 Đã xuất PDF!')
    })
  })
}

onMounted(() => {
  if (!store.isCalculated && store.inputAmount) {
    store.calculate()
  }
})
</script>

<style scoped>
.result-enter-active, .result-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.result-enter-from, .result-leave-to {
  opacity: 0; transform: translateY(8px);
}
.toast-enter-active, .toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0; transform: translateY(8px);
}
</style>
