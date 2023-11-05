import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messageStore', () => {
  const allMessages = ref({});
  const history = ref([]);
  const openedChatId = ref('');
  let intervalId = 0;
  let elementIntervalId = 0;

  watch(allMessages, (newProperty) => {
    // if (openedChatId.value.includes(newProperty[openedChatId.value][0].receiver_id)) {
    //   document.querySelector('.opened-chat').scrollBy(0,document.querySelector('.opened-chat').scrollHeight);
    //   return;
    // }
  }, { deep: true });

 /*function $reset() {
    allMessages.value = {};
    history.value = [];
    openedChatId.value = 0;
  };*/

  return { allMessages, history, openedChatId, intervalId };
})



