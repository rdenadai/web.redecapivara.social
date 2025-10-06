<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 transition-opacity"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            :class="[
              'relative bg-white rounded-2xl shadow-2xl transform transition-all',
              'w-full max-w-lg mx-auto',
              sizeClasses,
            ]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div
              v-if="$slots.header || title"
              class="flex items-center justify-between p-6 border-b border-gray-200"
            >
              <slot name="header">
                <h3 class="text-xl font-semibold text-capivara-stone">
                  {{ title }}
                </h3>
              </slot>
              <button
                v-if="closable"
                @click="close"
                class="text-capivara-stone/40 hover:text-capivara-stone transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-6">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200"
            >
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  size: {
    type: String,
    default: "md",
    validator: (value) => ["sm", "md", "lg", "xl"].includes(value),
  },
  closable: {
    type: Boolean,
    default: true,
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "close"]);

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
}[props.size];

function close() {
  emit("update:modelValue", false);
  emit("close");
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    close();
  }
}

// Previne scroll do body quando modal está aberto
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div > div,
.modal-leave-active > div > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div > div,
.modal-leave-to > div > div {
  transform: scale(0.95);
}
</style>
