<template>
  <div class="min-h-screen bg-capivara-off-white">
    <MenuView />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="card mb-8 bg-gradient-to-r text-white">
        <ProfileView />
        <!-- Separator -->
        <div class="mt-5 pt-6 border-t border-capivara-stone/10"></div>
        <div class="flex items-center gap-4 text-capivara-brown/80">
          <TimelineView />
        </div>
        <div class="mt-8">
          <div class="from-capivara-brown/5 to-capivara-green-lake/5">
            <div class="text-center">
              <!-- Footer -->
              <div class="mt-5 pt-6 border-t border-capivara-stone/10">
                <p class="text-xs text-capivara-stone/50 mt-1">
                  💚 Apoie o Projeto, cada contribuição ajuda a manter o projeto
                  rodando! 🙏
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import ProfileView from "./logged/ProfileView.vue";
import TimelineView from "./logged/TimelineView.vue";
import MenuView from "./MenuView.vue";
</script>
