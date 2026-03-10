<template>
  <div>
    <Line
      v-if="chartData"
      :data="chartData"
      :options="chartOptions"
      class="max-h-52"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
)

const props = defineProps({
  chartData: Object,
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        font: { size: 10, family: "'Space Mono'" },
        padding: 12,
        usePointStyle: true,
        pointStyleWidth: 8,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)}tr`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        maxTicksLimit: 8,
        font: { size: 9, family: "'Space Mono'" },
      },
    },
    y: {
      grid: {
        color: 'rgba(148,163,184,0.1)',
      },
      ticks: {
        callback: (v) => v.toFixed(0) + 'tr',
        font: { size: 9, family: "'Space Mono'" },
        maxTicksLimit: 6,
      },
    },
  },
}))
</script>
