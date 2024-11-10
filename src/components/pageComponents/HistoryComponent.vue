<script setup>
import { useMessagesStore } from "../../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useCurrentReceiverStore } from "../../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();

import ProfilePicture from '../detailsComponents/ProfilePictureComponent.vue';

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
    <div class="history-message">
      <ProfilePicture />
      <div class="info">
        <h4 class="receiver-name"> {{ chat.name }} </h4>
        <p class="message">{{ chat.message }}</p>
      </div>
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
  display: flex;
}

h4 {
  margin: 0;
  margin-top: 5px;
}

.message {
  margin-top: 5px;
}
</style>
