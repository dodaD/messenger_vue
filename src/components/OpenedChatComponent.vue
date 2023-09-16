<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();
import MessageComponent from "../components/MessageComponent.vue";
//import SendMessageComponent from "../components/SendMessageComponent.vue";
//import ReceiverInfoComponent from "../components/ReceiverInfoComponent.vue";
</script>

<template>
  <div class="activeChat">
    <!-- <ReceiverInfoComponent> </ReceiverInfoComponent> -->
    <p v-if="messagesStore.openedChatId !== 0"> TODO: text from file using library, that in future I could translate
      easily
    </p>
    <div v-for="message in messagesStore.allMessages[messagesStore.openedChatId]" :key="message.id"
      :class="message.user_id === currentUserStore.userId ? 'sent-message' : 'received-message'">
      <MessageComponent :message="message"> </MessageComponent>
    </div>
  </div>
</template>
