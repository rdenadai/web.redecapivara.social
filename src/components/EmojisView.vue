<template>
  <unicode-emoji-picker version="16.0" @emoji-pick="emojiSelected"></unicode-emoji-picker>
</template>

<script setup>
import { defineEmits, ref } from 'vue'
import 'unicode-emoji-picker'

const emit = defineEmits(['emojiSelected'])

const emojiSelected = (emoji) => {
  const emojiChar = emoji.detail.emoji ?? ''
  emit('emojiSelected', emojiChar)
}
</script>

<style scoped>
unicode-emoji-picker {
  width: 100%;
  height: 350px;
  border: none;
  font-size: 14px;
  --uep-background-color: var(--capivara-stone);
  --uep-accent-color: var(--capivara-brown);
  --uep-text-color: var(--text-primary);
  touch-action: manipulation;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  unicode-emoji-picker {
    height: 400px;
    font-size: 20px;
  }
}
</style>
