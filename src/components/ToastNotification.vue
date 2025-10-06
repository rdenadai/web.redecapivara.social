<template>
  <transition name="toast">
    <div
      v-if="visible"
      :class="[
        'fixed bottom-4 right-4 z-50 max-w-sm w-full',
        'card shadow-2xl',
        typeClasses,
      ]"
      role="alert"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <component :is="icon" class="w-6 h-6" />
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium">{{ message }}</p>
        </div>
        <button
          @click="close"
          class="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span class="sr-only">Fechar</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info",
    validator: (value) =>
      ["success", "error", "warning", "info"].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["close"]);

const visible = ref(false);

const typeClasses = computed(() => {
  const classes = {
    success: "bg-capivara-green-lake/10 text-capivara-green-lake",
    error: "bg-red-50 text-red-700",
    warning: "bg-yellow-50 text-yellow-700",
    info: "bg-capivara-sky-blue/10 text-capivara-sky-blue",
  };
  return classes[props.type];
});

const icon = computed(() => {
  const icons = {
    success: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M5 13l4 4L19 7",
        }),
      ]),
    error: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M6 18L18 6M6 6l12 12",
        }),
      ]),
    warning: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
        }),
      ]),
    info: () =>
      h("svg", { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, [
        h("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        }),
      ]),
  };
  return icons[props.type];
});

function close() {
  visible.value = false;
  emit("close");
}

onMounted(() => {
  visible.value = true;
  if (props.duration > 0) {
    setTimeout(close, props.duration);
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
