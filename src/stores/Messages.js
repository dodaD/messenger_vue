import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { useErrorStore } from '@/stores/Error.js';
import { useRouter } from 'vue-router';
import { useCookies } from 'vue3-cookies';
import { useUserStore } from '@/stores/User.js';
import { useCurrentReceiverStore } from '@/stores/CurrentReceiver';

const { cookies } = useCookies();

export const useMessagesStore = defineStore('messageStore', () => {
  const router = useRouter();
  const errorStore = useErrorStore();
  const userStore = useUserStore();
  const receiverStore = useCurrentReceiverStore();
  const allMessages = ref({});
  const history = ref([]);
  const openedChatId = ref('');
  let historyIntervalId = 0;
  let chatBetweenUsersIntervalId = 0;

  function checkResponse(response, error) {
    if (response.status === 401) {
      clearInterval(historyIntervalId);
      userStore.logOut();
      return "bad";
    }

    if (!response.ok) {
      errorStore.storeErrors(error);
      return;
    }
  }

  async function getHistory() {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/history', {
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      }
    });
    const responseJSON = await response.json();
    if (checkResponse(response, responseJSON.error) === "bad") {
      return null;
    }
    return responseJSON;
  }

  async function getInitialHistory() {
    if (historyIntervalId === 0) {
      historyIntervalId = setInterval(updateHistory, 5000);
    }
    history.value = await getHistory();
    if (history.value === null) {
      return;
    }
    history.value.forEach(chatInHistory => {
      const chatId = chatInHistory.interlocutorId;
      allMessages.value[chatId] = [];
    });
  };

  async function updateHistory() {
    const newHistory = await getHistory();
    if (newHistory === null) {
      return;
    }
    // FIXME chitati tyt
    if (history.value.length !== newHistory.length) {
      if (history.value[0]?.message !== newHistory[0]?.message) {
        for (let i = 0; i < newHistory.length - history.value.length; i++) {
          history.value.unshift(newHistory[i]);
        }
      }
    } else {
      for (let i = 0; i < history.value.length; i++) {
        if (newHistory[i]?.message !== history.value[i].message) {
          history.value[i] = newHistory[i];
        }
      }
    }
  }

  async function getMessagesFromChat(page, receiverId) {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/chat-beetween-users?page=' + page, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
      body: JSON.stringify({
        receiver_id: receiverId,
      })
    });

    const responseJSON = await response.json();
    checkResponse(response, responseJSON.error);
    return responseJSON;
  }

  async function setGetChatMesssagesInterval(receiverId) {
    const newMessages = await getMessagesFromChat(1, receiverId);
    allMessages.value[openedChatId.value] = newMessages.data;
    if (chatBetweenUsersIntervalId !== 0) {
      clearInterval(chatBetweenUsersIntervalId);
    }
    chatBetweenUsersIntervalId = setInterval(async () => {
      if (openedChatId.value === 0) {
        return;
      };

      const newMessages = await getMessagesFromChat(1, receiverId);
      allMessages.value[openedChatId.value] = newMessages.data;
    }, 5000);
  }

  async function updateMessage(messageId, updatedMessage) {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/edit/' + messageId, {
      method: "PATCH",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
      body: JSON.stringify({
        message: updatedMessage,
      })
    });
    const responseJSON = await response.json();
    checkResponse(response, responseJSON.error);

    let openedChatMessages = allMessages.value[openedChatId.value];
    let changedMessageId = openedChatMessages.findIndex((message) => message.id === messageId);
    if (updatedMessage === openedChatMessages[changedMessageId].message) {
      return;
    }
    openedChatMessages[changedMessageId].message = responseJSON.message;
    openedChatMessages[changedMessageId].updated_at = responseJSON.updated_at;
  }

  async function deleteMessage(messageId) {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/' + messageId, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
    });
    const responseJSON = await response.json();
    checkResponse(response, responseJSON.error);
    allMessages[openedChatId.value] = allMessages.value[openedChatId.value].filter(message => message.id !== messageId);
  }

  async function sendMessage(newMessage) {
    if (newMessage === '') {
      errorStore.storeErrors('Nothing to send');
      return;
    }
    if (receiverStore.receiverId === 0) {
      errorStore.storeErrors('No chat was selected');
      return;
    }
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/add', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
      body: JSON.stringify({
        message: newMessage,
        receiver_id: receiverStore.receiverId,
        receiver: receiverStore.entity,
      })
    });
    const responseJSON = await response.json();
    checkResponse(response, responseJSON.error);
    allMessages.value[openedChatId.value].unshift(responseJSON);
    const historyChatId = history.value.findIndex(obj => {
      return obj.interlocutorId === receiverStore.receiverId && obj.receiver_type == responseJSON.receiver_type || obj.id === receiverStore.receiverId && obj.receiver_type === undefined;
    });
    history.value[historyChatId].message = responseJSON.message;
  }

  watch(allMessages, (newProperty) => {
    if (openedChatId.value === "") {
      return;
    }
    // цей код скролить вниз коли приходить нове повідомлення
    if (openedChatId.value.includes(newProperty[openedChatId.value][0]?.receiver_id)) {
      document.querySelector('.opened-chat').scrollBy(0, document.querySelector('.opened-chat').scrollHeight);
      return;
    }
  }, { deep: true });

  return { allMessages, history, openedChatId, historyIntervalId, getInitialHistory, setGetChatMesssagesInterval, getMessagesFromChat, updateMessage, deleteMessage, sendMessage };
})



