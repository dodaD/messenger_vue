import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useErrorStore } from '@/stores/Error.js';
import { useCookies } from 'vue3-cookies';
import { useUserStore } from '@/stores/User.js';
import { useCurrentReceiverStore } from '@/stores/CurrentReceiver';

const { cookies } = useCookies();

export const useMessagesStore = defineStore('messageStore', () => {
  const errorStore = useErrorStore();
  const userStore = useUserStore();
  const receiverStore = useCurrentReceiverStore();
  const allMessages = ref({});
  const history = ref([]);
  const openedChatId = ref('');
  window.window.historyGlobalInterval = 0;
  let chatBetweenUsersIntervalId = 0;
  const howManyNewMessages = ref(0);

  function checkResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        userStore.logOut();
      }
      const responseObject = {
        [response.status]: response.statusText
      };
      errorStore.storeErrors(responseObject);
      return "bad";
    }

    return "good";
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
    if (window.window.historyGlobalInterval === 0) {
      window.window.historyGlobalInterval = setInterval(updateHistory, 5000);
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
    if (checkResponse(response, responseJSON.error) === "bad") {
      return null;
    }
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
      if (newMessages === null) {
        clearInterval(chatBetweenUsersIntervalId);
        return;
      }
      if (allMessages.value[openedChatId.value][0].id === newMessages.data[0].id) {
        return;
      } else {
        findHowManyNewMessages(newMessages.data);
        allMessages.value[openedChatId.value] = newMessages.data;
        receiverStore.page = 1;
        //here goes logic of showing little arrow of new message 
      }
    }, 5000);
  }

  function findHowManyNewMessages(newMessages) {
    if (newMessages.length > allMessages.value[openedChatId.value].length) {
      howManyNewMessages.value = newMessages.length - allMessages.value[openedChatId.value].length;
      return;
    }

    for (let i = 0; i < newMessages.length; i++) {
      if (i + howManyNewMessages.value >= newMessages.length) {
        return;
      }
      let currentMessageAtThatId = allMessages.value[openedChatId.value][i];
      let newMessageAtThatId = newMessages[i + howManyNewMessages.value];

      //If new id is less than currentMessageAtThatId, that means message was deleted; if it equal old id, no changes
      if (newMessageAtThatId.id <= currentMessageAtThatId.id) {
        continue;
      }
      howManyNewMessages.value += 1;
    }
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
    if (checkResponse(response, responseJSON.error) === "bad") {
      return null;
    }

    let openedChatMessages = allMessages.value[openedChatId.value];
    let changedMessageId = openedChatMessages.findIndex((message) => message.id === messageId);
    if (updatedMessage === openedChatMessages[changedMessageId].message) {
      return;
    }
    openedChatMessages[changedMessageId].message = responseJSON.message;
    openedChatMessages[changedMessageId].updated_at = responseJSON.updated_at;
  }

  async function deleteMessage(messageId) {
    const indexOfDeletedMessage = allMessages.value[openedChatId.value].findIndex((message) => message.id === messageId);
    const deletedMessage = allMessages.value[openedChatId.value][indexOfDeletedMessage];
    allMessages.value[openedChatId.value].splice(indexOfDeletedMessage, 1);

    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/' + messageId, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
    });
    const responseJSON = await response.json();
    if (checkResponse(response, responseJSON.error) === "bad") {
      allMessages.value[openedChatId.value].splice(indexOfDeletedMessage, 0, deletedMessage);
      return null;
    }
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
    if (checkResponse(response, responseJSON.error) === "bad") {
      return null;
    }
    allMessages.value[openedChatId.value].unshift(responseJSON);
    //  TODO: when different entities also check for them too
    //  Ex: ... && obj.receiver_type == receiverStore.entity
    const historyChatId = history.value.findIndex(obj => {
      return obj.interlocutorId === receiverStore.receiverId || obj.id === receiverStore.receiverId && obj.receiver_type === undefined;
    });
    history.value[historyChatId].message = responseJSON.message;
  }

  return { allMessages, history, openedChatId, getInitialHistory, setGetChatMesssagesInterval, getMessagesFromChat, updateMessage, deleteMessage, sendMessage, howManyNewMessages };
})



