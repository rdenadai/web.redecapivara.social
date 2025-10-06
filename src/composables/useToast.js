import { ref } from "vue";

const toasts = ref([]);

export function useToast() {
  function addToast(message, type = "info", duration = 3000) {
    const id = Date.now();
    toasts.value.push({
      id,
      message,
      type,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }

  function removeToast(id) {
    const index = toasts.value.findIndex((t) => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  }

  function success(message, duration) {
    return addToast(message, "success", duration);
  }

  function error(message, duration) {
    return addToast(message, "error", duration);
  }

  function warning(message, duration) {
    return addToast(message, "warning", duration);
  }

  function info(message, duration) {
    return addToast(message, "info", duration);
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}
