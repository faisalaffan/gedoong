import { ref } from 'vue'
import type { ToastItem } from '~/types/listing'

let _toastId = 0

const toasts = ref<ToastItem[]>([])

export function useToast() {
  function showToast(message: string, type: 'success' | 'error' = 'success') {
    const id = _toastId++
    toasts.value.push({ id, message, type })
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 4000)
  }

  return { toasts, showToast }
}
