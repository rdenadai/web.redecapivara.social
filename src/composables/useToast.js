import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()
    toasts.value.push({
      id,
      message,
      type,
      duration,
    })

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message, duration) => {
    return addToast(message, 'success', duration)
  }

  const error = (message, duration) => {
    return addToast(message, 'error', duration)
  }

  const warning = (message, duration) => {
    return addToast(message, 'warning', duration)
  }

  const info = (message, duration) => {
    return addToast(message, 'info', duration)
  }

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
