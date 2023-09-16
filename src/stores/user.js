import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userId = ref(0);

 function $reset() {
    userId.value = 0;
  };

  return { userId };
})
