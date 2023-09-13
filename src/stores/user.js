import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userId = ref(0);
  const currentChat = ref([]);

 function $reset() {
    userId.value = 0;
    currentChat.value = [];
  };

  function resetChat() {
    currentChat.value = [];
  };

  return { userId, currentChat, resetChat };
})
