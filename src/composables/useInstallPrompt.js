import { ref, onMounted, onUnmounted } from 'vue'

// Composable to manage the beforeinstallprompt flow
export function useInstallPrompt() {
  const deferredPrompt = ref(null)
  const isInstallable = ref(false)

  function onBeforeInstallPrompt(e) {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
  }

  function onAppInstalled() {
    // Reset state after installation
    deferredPrompt.value = null
    isInstallable.value = false
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.removeEventListener('appinstalled', onAppInstalled)
  })

  async function promptInstall() {
    try {
      const accept = confirm(`Deseja instalar o aplicativo Rede Capivara no dispositivo?`)
      if (accept) {
        try {
          deferredPrompt.value.prompt()
          const choice = await deferredPrompt.value.userChoice
          // Clear prompt regardless of outcome
          deferredPrompt.value = null
          isInstallable.value = false
        } catch (err) {
          console.error('Install prompt failed:', err)
        }
      }
    } catch (err) {
      console.error('Auto-install prompt failed:', err)
    }
  }

  return {
    isInstallable,
    promptInstall,
    deferredPrompt,
  }
}
