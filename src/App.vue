<template>
  <div :class="['min-h-screen', 'transition-colors', 'duration-300']">
    <!-- Sidebar Navigation -->
    <aside
      class="fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col hidden lg:flex"
    >
      <!-- Logo -->
      <div class="p-6 border-b border-slate-100 dark:border-slate-800">
        <RouterLink to="/" class="flex items-center gap-3">
          <div class="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div class="font-bold text-slate-900 dark:text-white text-sm leading-tight">VN Finance</div>
            <div class="text-xs text-slate-400 dark:text-slate-500">Tools</div>
          </div>
        </RouterLink>
      </div>

      <!-- Nav Links -->
      <nav class="flex-1 p-4 space-y-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
            $route.path === item.path
              ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
          ]"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span
            v-if="$route.path === item.path"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500"
          ></span>
        </RouterLink>
      </nav>

      <!-- Dark mode toggle + footer -->
      <div class="p-4 border-t border-slate-100 dark:border-slate-800">
        <button
          @click="appStore.toggleDark()"
          class="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-150"
        >
          <span class="text-lg">{{ appStore.isDark ? '☀️' : '🌙' }}</span>
          <span>{{ appStore.isDark ? 'Sáng' : 'Tối' }} Mode</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center justify-between px-4 h-14">
        <RouterLink to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="font-bold text-sm text-slate-900 dark:text-white">VN Finance</span>
        </RouterLink>
        <div class="flex items-center gap-2">
          <button @click="appStore.toggleDark()" class="btn-ghost p-2 text-base">
            {{ appStore.isDark ? '☀️' : '🌙' }}
          </button>
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="btn-ghost p-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Drawer -->
    <Transition name="slide">
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden fixed inset-0 z-50"
        @click.self="mobileMenuOpen = false"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="mobileMenuOpen = false"></div>
        <div class="absolute top-0 right-0 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl">
          <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">Menu</span>
            <button @click="mobileMenuOpen = false" class="btn-ghost p-1.5">✕</button>
          </div>
          <nav class="p-4 space-y-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="mobileMenuOpen = false"
              :class="[
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all',
                $route.path === item.path
                  ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >
              <span class="text-lg">{{ item.icon }}</span>
              <span>{{ item.label }}</span>
            </RouterLink>
          </nav>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAppStore } from '@/stores/appStore.js'

const appStore = useAppStore()
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', icon: '🏠', label: 'Trang chủ' },
  { path: '/salary', icon: '💰', label: 'Tính Lương' },
  { path: '/loan', icon: '🏦', label: 'Tính Vay' },
  { path: '/tax', icon: '📊', label: 'Thuế TNCN' },
  { path: '/history', icon: '📋', label: 'Lịch Sử' },
]
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.2s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}
</style>
