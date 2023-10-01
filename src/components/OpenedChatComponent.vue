<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();

import { useCurrentReceiverStore } from "../stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import MessageComponent from "../components/MessageComponent.vue";
import SendMessageComponent from "../components/SendMessageComponent.vue";
import ReceiverInfoComponent from "../components/ReceiverInfoComponent.vue";

setInterval(async () => {
  if (messagesStore.openedChatId === 0) {
    return;
  };
  const response = await fetch('http://localhost/api/message/chat-beetween-users?page=1', {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      receiver_id: receiverStore.receiverId,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  const OldMessages = messagesStore.allMessages[messagesStore.openedChatId];
  const newMessages = responseJSON.data;
  if (OldMessages[OldMessages.length - 1].id === newMessages[newMessages.length - 1].id) {
    return;
  }
  messagesStore.allMessages[messagesStore.openedChatId] = newMessages;
  /*//const historyChatWithReceiverId = messagesStore.history.findIndex(obj => {
     return obj.interlocutorId === receiverStore.receiverId && obj.receiver_type == newMessages.receiver_type;
   });
   messagesStore.history[historyChatWithReceiverId].message = newMessages[newMessages.length - 1].message;*/
}, 5000);
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

<style scoped>
.active-chat {
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
