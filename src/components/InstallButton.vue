<template>
  <button
    v-if="isInstallable"
    @click="install"
    class="btn-secondary ml-3"
    title="Instalar aplicativo"
  >
    Instalar
  </button>
</template>

<script setup>
import { useInstallPrompt } from "@/composables/useInstallPrompt";

const { isInstallable, promptInstall } = useInstallPrompt();

async function install() {
  const outcome = await promptInstall();
  // you might want to show a toast based on outcome
  console.log("Install outcome:", outcome);
}
</script>
