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
  receiverStore.receiverNickname = message.nickname
  /*--
     ----------------------------------------------------
     TODOS
     ---------------------------------------------------
  
     TODO 1: When there's different enities in production change the entity to dif things here, and use
            it for searching chat in history
            Ex: receiverStore.entity = message.nickname;
      
  -*/

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

<style scoped lang="scss">
@import "@/styles/colours.scss";

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
