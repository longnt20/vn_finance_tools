<template>
  <div class="animate-fade-in">
    <!-- Hero Section -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-slate-800 p-8 md:p-12 mb-8 text-white">
      <!-- Background decoration -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -left-20 w-60 h-60 bg-slate-600/30 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>

      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-xs font-medium mb-6">
          <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse-slow"></span>
          Theo luật thuế Việt Nam mới nhất 2026
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-3 leading-tight">
          Công Cụ Tài Chính<br>
          <span class="text-brand-300">Cá Nhân Việt Nam</span>
        </h1>
        <p class="text-brand-100/80 max-w-lg text-sm md:text-base leading-relaxed mb-8">
          Tính toán lương Gross/Net, khoản vay mua nhà/xe, và thuế thu nhập cá nhân
          theo quy định mới nhất của pháp luật Việt Nam.
        </p>

        <!-- Quick stats -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div class="text-2xl font-bold font-mono">3</div>
            <div class="text-xs text-brand-200 mt-0.5">Công cụ</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div class="text-2xl font-bold font-mono">100%</div>
            <div class="text-xs text-brand-200 mt-0.5">Miễn phí</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div class="text-2xl font-bold font-mono">VN</div>
            <div class="text-xs text-brand-200 mt-0.5">Luật Việt Nam</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools Grid -->
    <h2 class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Công cụ</h2>
    <div class="grid md:grid-cols-3 gap-4 mb-8">
      <RouterLink
        v-for="tool in tools"
        :key="tool.path"
        :to="tool.path"
        class="card-hover group p-6 cursor-pointer"
      >
        <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4', tool.iconBg]">
          {{ tool.icon }}
        </div>
        <h3 class="font-bold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {{ tool.title }}
        </h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ tool.description }}</p>
        <div class="mt-4 flex flex-wrap gap-1.5">
          <span
            v-for="tag in tool.tags"
            :key="tag"
            class="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full"
          >{{ tag }}</span>
        </div>
      </RouterLink>
    </div>

    <!-- How it works -->
    <div class="card p-6 mb-8">
      <h2 class="font-bold text-slate-900 dark:text-slate-100 mb-4">Thông tin áp dụng</h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <div v-for="info in taxInfo" :key="info.label" class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-sm flex-shrink-0">
            {{ info.icon }}
          </div>
          <div>
            <div class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ info.label }}</div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ info.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const tools = [
  {
    path: '/salary',
    icon: '💵',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50',
    title: 'Tính Lương Gross ↔ Net',
    description: 'Tính chuyển đổi lương Gross và Net có tính bảo hiểm, thuế TNCN lũy tiến và giảm trừ gia cảnh.',
    tags: ['BHXH 8%', 'BHYT 1.5%', 'BHTN 1%', 'Lũy tiến 5 bậc'],
  },
  {
    path: '/loan',
    icon: '🏠',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50',
    title: 'Tính Vay Mua Nhà / Xe',
    description: 'Tính toán khoản vay theo phương pháp dư nợ giảm dần hoặc trả góp đều với lịch trả nợ chi tiết.',
    tags: ['Dư nợ giảm dần', 'Trả góp đều', 'Line chart'],
  },
  {
    path: '/tax',
    icon: '📊',
    iconBg: 'bg-orange-50 dark:bg-orange-950/50',
    title: 'Tính Thuế TNCN',
    description: 'Tính thuế thu nhập cá nhân theo tháng hoặc năm với đầy đủ các khoản giảm trừ theo quy định.',
    tags: ['Tháng / Năm', 'Giảm trừ gia cảnh', 'Biểu thuế lũy tiến'],
  },
]

const taxInfo = [
  { icon: '👤', label: 'Giảm trừ bản thân', value: '15.5 triệu đồng/tháng' },
  { icon: '👨‍👩‍👧', label: 'Giảm trừ người phụ thuộc', value: '6.2 triệu đồng/người/tháng' },
  { icon: '🏥', label: 'Bảo hiểm người lao động', value: 'BHXH 8% + BHYT 1.5% + BHTN 1%' },
  { icon: '📈', label: 'Biểu thuế lũy tiến', value: '5 bậc: 5% → 10% → 20% → 30% → 35%' },
]
</script>
