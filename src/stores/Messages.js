import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messageStore', () => {
  const allMessages = ref({});
  const history = ref([]);
  const openedChatId = ref(0);

 /*function $reset() {
    allMessages.value = {};
    history.value = [];
    openedChatId.value = 0;
  };*/

  return { allMessages, history, openedChatId };
})



