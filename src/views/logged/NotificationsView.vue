<template>
  <div class="min-h-screen bg-capivara-off-white">
    <MenuView />
    <!-- Main Content -->
    <main class="max-w-7xl mx-auto md:px-4 md:py-4">
      <NotificationsList />
    </main>
  </div>
</template>
<script setup>
import MenuView from "../MenuView.vue";
import NotificationsList from "@/components/NotificationsList.vue";
</script>
