import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentReceiverStore = defineStore('receiverStore', () => {
  const receiverId = ref(0);
  const receiverName = ref('');
  const receiverNickname = ref('');
  const entity = ref('');
  const page = ref(1);
  const link = ref('');

  function $reset() {
    receiverId.value = 0;
    receiverName.value = '';
    receiverNickname.value = '';
    entity.value = '';
    page.value = 1;
    link.value = '';
  }

  return { receiverId, receiverName, receiverNickname, entity, page, link };
})
