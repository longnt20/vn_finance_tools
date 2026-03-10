import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/main.css'

// Pages
import HomePage from './pages/HomePage.vue'
import SalaryCalculatorPage from './pages/SalaryCalculatorPage.vue'
import LoanCalculatorPage from './pages/LoanCalculatorPage.vue'
import TaxCalculatorPage from './pages/TaxCalculatorPage.vue'
import HistoryPage from './pages/HistoryPage.vue'

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Trang chủ' } },
  { path: '/salary', component: SalaryCalculatorPage, meta: { title: 'Tính Lương Gross ↔ Net' } },
  { path: '/loan', component: LoanCalculatorPage, meta: { title: 'Tính Vay Mua Nhà / Xe' } },
  { path: '/tax', component: TaxCalculatorPage, meta: { title: 'Tính Thuế TNCN' } },
  { path: '/history', component: HistoryPage, meta: { title: 'Lịch Sử Tính Toán' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } },
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | VN Finance Tools`
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
