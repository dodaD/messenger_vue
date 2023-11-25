import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMessagesStore } from "@/stores/Messages";

export const useCurrentReceiverStore = defineStore('receiverStore', () => {
  const messagesStore = useMessagesStore();
  const receiverId = ref(0);
  const receiverName = ref('');
  const receiverNickname = ref('');
  const entity = ref('');
  const page = ref(1);
  const link = ref('');
  const maxPage = ref(0);

  function openChat(name, nickname, userId) {
    const chatId = entity.value + userId;
    receiverId.value = userId;
    receiverName.value = name;
    receiverNickname.value = nickname;
    messagesStore.openedChatId = chatId;
    messagesStore.setGetChatMesssagesInterval(receiverId.value);

    if (messagesStore.allMessages[chatId] === undefined) {
      const receiverInfo = { name: name, nickname: nickname, interlocutorId: userId };
      messagesStore.history.unshift(receiverInfo);
      return;
    };
  }

  return { receiverId, receiverName, receiverNickname, entity, page, link, maxPage, openChat };
})
