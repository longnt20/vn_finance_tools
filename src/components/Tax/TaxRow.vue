<template>
  <div :class="[
    'flex items-center justify-between text-sm py-1.5',
    highlight ? 'font-semibold' : '',
    isNet ? 'border-t border-slate-200 dark:border-slate-700 pt-2 mt-1' : '',
  ]">
    <span :class="[
      isDeduction ? 'text-red-500 dark:text-red-400 text-xs' : '',
      isTax ? 'text-orange-600 dark:text-orange-400 font-semibold' : '',
      isNet ? 'text-brand-600 dark:text-brand-400 font-bold' : '',
      isSubtotal ? 'text-slate-600 dark:text-slate-400 font-medium text-xs' : '',
      isGross ? 'text-slate-700 dark:text-slate-300 font-semibold' : '',
      'flex-1',
    ]">{{ label }}</span>
    <span :class="[
      'font-mono',
      isDeduction ? 'text-red-500 dark:text-red-400 text-xs' : '',
      isTax ? 'text-orange-600 dark:text-orange-400 font-bold text-base' : '',
      isNet ? 'text-brand-600 dark:text-brand-400 font-bold text-base' : '',
      isSubtotal ? 'text-slate-500 dark:text-slate-400 text-xs' : '',
      isGross ? 'text-slate-800 dark:text-slate-200 font-semibold' : '',
    ]">
      {{ isDeduction ? '-' : '' }}{{ value?.toFixed(3) }} <span class="text-xs font-normal opacity-60">tr</span>
    </span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: Number,
  isDeduction: Boolean,
  isSubtotal: Boolean,
  isTax: Boolean,
  isNet: Boolean,
  isGross: Boolean,
  highlight: Boolean,
})
</script>
