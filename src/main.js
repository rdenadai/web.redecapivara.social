import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// PWA registration
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível! Deseja atualizar?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    // console.log("App pronto para uso offline");
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
