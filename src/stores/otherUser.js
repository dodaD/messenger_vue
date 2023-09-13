import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useOtherUserStore = defineStore('element', () => {
  const otherUserId = ref(0);
  const userName = ref('');
  const userNickname = ref('');
  const entity = ref('');
 // const doubleCount = computed(() => count.value * 2)
 // function increment() {
 //   count.value++
 // }
  function $reset() {
    userId.value = 0;
    userName.value = '';
    userNickname.value = '';
    entity.value = '';
  }

  return { otherUserId, userName, userNickname, entity };
})
