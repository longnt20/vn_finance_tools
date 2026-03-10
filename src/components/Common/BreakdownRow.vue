<template>
  <div :class="['flex items-center gap-3 py-1.5', isTotal ? 'mt-1' : '']">
    <!-- Color indicator -->
    <div :class="['w-2.5 h-2.5 rounded-full flex-shrink-0', color]"></div>

    <!-- Label -->
    <div :class="['flex-1 text-sm', isTotal ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400']">
      {{ label }}
    </div>

    <!-- Progress bar (only for non-total) -->
    <div v-if="!isTotal" class="w-20 hidden sm:block">
      <div class="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          :class="['h-full rounded-full transition-all duration-500', color]"
          :style="{ width: `${Math.min(100, percentage)}%` }"
        ></div>
      </div>
    </div>

    <!-- Percentage -->
    <div class="text-xs font-mono text-slate-400 w-10 text-right hidden sm:block">
      {{ percentage.toFixed(1) }}%
    </div>

    <!-- Amount -->
    <div :class="[
      'font-mono text-sm font-semibold w-24 text-right',
      type === 'deduction' ? 'text-red-500 dark:text-red-400' : '',
      type === 'income' ? 'text-brand-600 dark:text-brand-400' : '',
      isTotal ? 'text-base' : '',
    ]">
      {{ type === 'deduction' ? '-' : '' }}{{ amount.toFixed(3) }}tr
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  amount: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  color: { type: String, default: 'bg-slate-400' },
  type: { type: String, default: 'deduction' }, // 'deduction' | 'income'
  isTotal: { type: Boolean, default: false },
})
</script>
