<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

(async () => {
  console.log(cookies.get("authToken"));
  const response = await fetch('http://localhost/api/message/history', { //TODO change to env variable 
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    //TODO push to login page
    return;
  }
  messagesStore.history = responseJSON;
})();

async function openChat(message) {
  const chatId = message.entity + message.interlocutorId;
  console.log(chatId);
  messagesStore.openedChatId = chatId;
  if (messagesStore.allMessages.chatId !== undefined) {
    return;
  };
  let link = '';
  switch (message.receiver_type) {
    case 'App\\Models\\Group':
      link = 'http://localhost/api/message/group-chat?page=1';
      break;
    case 'App\\Models\\Channel':
      link = 'http://localhost/api/message/channel-chat?page=1';
      break;
    default:
      link = 'http://localhost/api/message/chat-beetween-users?page=1';
  }
  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      receiver_id: message.receiver_id,
      sender_id: message.user_id,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  messagesStore.chatId = responseJSON.data;
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
}
</style>
