<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();

import MessageComponent from "../components/MessageComponent.vue";
import SendMessageComponent from "../components/SendMessageComponent.vue";
import ReceiverInfoComponent from "../components/ReceiverInfoComponent.vue";

</script>

<template>
  <div class="active-chat">
    <ReceiverInfoComponent> </ReceiverInfoComponent>
    <p v-if="messagesStore.openedChatId !== 0"> TODO: text from file using library, that in future I could translate
      easily
    </p>
    <div v-for="message in   messagesStore.allMessages[messagesStore.openedChatId]  " :key="message.id"
      :class="message.user_id === loggedInUser.userId ? 'sent-message' : 'received-message'"
      @click="console.log(loggedInUser.userId)">
      <MessageComponent :message="message"> </MessageComponent>
    </div>
    <SendMessageComponent> </SendMessageComponent>
  </div>
</template>

<style scoped> .active-chat {
   display: flex;
   overflow-y: scroll;
   flex-direction: column;
 }

 .sent-message {
   margin-left: auto;
 }

 .received-message {
   margin-right: auto;
 }
</style>
