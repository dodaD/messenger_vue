<script>
import { useUserStore } from "../stores/User.js";
const userStore = useUserStore();

import MessageComponent from "../components/MessageComponent.vue";
import SendMessageComponent from "../components/SendMessageComponent.vue";
import ReceiverInfoComponent from "../components/ReceiverInfoComponent.vue";
</script>

<template>
  <div class="activeChat">
    <ReceiverInfoComponent> </ReceiverInfoComponent>
    <p v-if="!userStore.currentChat.length"> TODO: text from file using library, that in future I could translate easily
    </p>
    <div v-for="message in userStore.currentChat" :key="message.id"
      :class="message.user_id === currentUserStore.userId ? 'sent-message' : 'received-message'">
      <MessageComponent :message="message"> </MessageComponent>
    </div>
    <SendMessageComponent> </SendMessageComponent>
  </div>
</template>
