<script setup>
import { useMessagesStore } from "../../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useCurrentReceiverStore } from "../../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();

messagesStore.getInitialHistory();

async function openChat(message) {
  const chatId = receiverStore.entity + message.interlocutorId;
  receiverStore.receiverId = message.interlocutorId;
  receiverStore.receiverName = message.name;
  receiverStore.receiverNickname = message.nickname;
  messagesStore.openedChatId = chatId;

  if (messagesStore.allMessages.chatId !== undefined) {
    return;
  };
  messagesStore.setGetChatMesssagesInterval(receiverStore.receiverId);
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
