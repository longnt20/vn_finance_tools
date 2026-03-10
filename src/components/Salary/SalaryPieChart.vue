<template>
  <div class="relative">
    <Doughnut
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
      class="max-h-52"
    />
    <!-- Legend -->
    <div class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
      <div
        v-for="(label, i) in chartData.labels"
        :key="label"
        class="flex items-center gap-2 text-xs"
      >
        <div
          class="w-2.5 h-2.5 rounded-full flex-shrink-0"
          :style="{ backgroundColor: chartData.datasets[0].backgroundColor[i] }"
        ></div>
        <span class="text-slate-600 dark:text-slate-400">{{ label }}</span>
        <span class="font-mono text-slate-500 dark:text-slate-400 ml-auto">
          {{ chartData.datasets[0].data[i]?.toFixed(2) }}tr
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  chartData: Object,
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  cutout: '65%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed.toFixed(3)} triệu (${((ctx.parsed / ctx.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`,
      },
    },
  },
}))
</script>
