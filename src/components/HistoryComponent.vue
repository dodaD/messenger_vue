<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useCurrentReceiverStore } from "../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();

import { useErrorStore } from '../stores/Error.js';
const errorStore = useErrorStore();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

(async () => {
  const response = await fetch('http://localhost/api/message/history', { //TODO change to env variable 
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (response.status === 401) {
    router.push('/login');
  }
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.error;
    return;
  }
  messagesStore.history = responseJSON;
})();


if (messagesStore.intervalId === 0) {
  messagesStore.intervalId = setInterval(async () => {
    const response = await fetch('http://localhost/api/message/history', { //TODO change to env variable 
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      }
    });
    const responseJSON = await response.json();
    if (response.status === 401) {
      cookies.remove("authToken");
      clearInterval(messagesStore.intervalId);
      messagesStore.intervalId = 0;
      router.push('/login');
      return;
    }
    if (!response.ok) {
      errorStore.errorMessage = responseJSON.error;
    }
    // FIXME chitati tyt
    if (messagesStore.history.length !== responseJSON.length) {
      if (messagesStore.history[0]?.message !== responseJSON[0]?.message) {
        for (let i = 0; i < responseJSON.length - messagesStore.history.length; i++) {
          messagesStore.history.unshift(responseJSON[i]);
        }
      }
    } else {
      for (let i = 0; i < messagesStore.history.length; i++) {
        if (responseJSON[i]?.message !== messagesStore.history[i].message) {
          messagesStore.history[i] = responseJSON[i];
        }
      }
    }
  }, 5000);
}

async function openChat(message) {
  switch (message.receiver_type) {
    case 'App\\Models\\Group':
      receiverStore.entity = 'group';
      receiverStore.link = 'http://localhost/api/message/group-chat?page=1';
      break;
    case 'App\\Models\\Channel':
      receiverStore.entity = 'channel';
      receiverStore.link = 'http://localhost/api/message/channel-chat?page=1';
      break;
    default:
      receiverStore.entity = 'user';
      receiverStore.link = 'http://localhost/api/message/chat-beetween-users?page=1';
  }
  const chatId = receiverStore.entity + message.interlocutorId;
  receiverStore.receiverId = message.interlocutorId;
  receiverStore.receiverName = message.name;
  receiverStore.receiverNickname = message.nickname;
  messagesStore.openedChatId = chatId;

  if (messagesStore.allMessages.chatId !== undefined) {
    return;
  };

  const response = await fetch(receiverStore.link, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      receiver_id: message.interlocutorId,
    })
  });
  const responseJSON = await response.json();
  if (response.status === 401) {
    cookies.remove("authToken");
    router.push('/login');
  }
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.error;
    return;
  }
  messagesStore.allMessages[chatId] = responseJSON.data;
}
</script>

<template>
  <div v-for="chat in messagesStore.history" @click="openChat(chat)" class="chat border">
    <div class="profile-picture"> Avatar </div>
    <div class="history-message">
      <h4 class="receiver-name"> {{ chat.name }} </h4>
      <p class="message">{{ chat.message }}</p>
    </div>
  </div>
</template>

<style>
.border {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: #ffe;
}

.chat {
  display: flex;
}

.history-message {
  border: 0;
  margin: 0;
  padding: 0;
}

h4 {
  margin: 0;
  margin-top: 5px;
}

.profile-picture {
  border: 1px solid black;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.message {
  margin-left: 10px;
  margin-top: 5px;
}
</style>
