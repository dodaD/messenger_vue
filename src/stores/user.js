import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
  const userId = ref(0)
 // const doubleCount = computed(() => count.value * 2)
 // function increment() {
 //   count.value++
 // }
  function $reset() {
    userId.value = 0
  }

  return { userId }
})
