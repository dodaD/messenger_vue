import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errorStore', () => {
  const errorMessage = ref('');

  watch(errorMessage, reset)
  function reset() {
    setTimeout(() => {
    errorMessage.value = '';
    }, 5000);
  }

  return { errorMessage };
})
