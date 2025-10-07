import { ref, onMounted, onUnmounted } from "vue";

// Composable to manage the beforeinstallprompt flow
export function useInstallPrompt() {
  const deferredPrompt = ref(null);
  const isInstallable = ref(false);

  function onBeforeInstallPrompt(e) {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    deferredPrompt.value = e;
    isInstallable.value = true;
    // Prompt the user with a simple confirmation dialog
    // If they accept, trigger the install flow automatically
    try {
      const host = window.location.hostname;
      const accept = confirm(
        `Deseja instalar o aplicativo Rede Capivara no dispositivo?`
      );
      if (accept) {
        // trigger install
        promptInstall();
      }
    } catch (err) {
      console.error("Auto-install prompt failed:", err);
    }
  }

  function onAppInstalled() {
    // Reset state after installation
    deferredPrompt.value = null;
    isInstallable.value = false;
  }

  onMounted(() => {
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
  });

  onUnmounted(() => {
    window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.removeEventListener("appinstalled", onAppInstalled);
  });

  async function promptInstall() {
    if (!deferredPrompt.value) return null;
    try {
      deferredPrompt.value.prompt();
      const choice = await deferredPrompt.value.userChoice;
      // Clear prompt regardless of outcome
      const outcome = choice.outcome;
      deferredPrompt.value = null;
      isInstallable.value = false;
      return outcome;
    } catch (err) {
      console.error("Install prompt failed:", err);
      return null;
    }
  }

  return {
    isInstallable,
    promptInstall,
    deferredPrompt,
  };
}
