<script setup>
import { useMessagesStore } from "@/stores/Messages.js";
const messagesStore = useMessagesStore();

import { useUserStore } from "@/stores/User.js";
const loggedInUser = useUserStore();

import { useCurrentReceiverStore } from "@/stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

import MessageComponent from "../MessageComponent.vue";
import SendMessageComponent from "../SendMessageComponent.vue";
import ReceiverInfoComponent from "../ReceiverInfoComponent.vue";

//  BUG: After replacing old messages with new, the scroll finished is always false
let scrollFinished = true;

async function getMoreMessages(event) {
  const scrollHeight = (event.target.scrollHeight - event.target.clientHeight) * 0.95;
  if (-1 * event.target.scrollTop > scrollHeight && scrollFinished) {
    scrollFinished = false;
    if (receiverStore.page >= receiverStore.maxPage && receiverStore.maxPage !== 0) {
      return;
    }
    receiverStore.page++;

    const newMessages = await messagesStore.getMessagesFromChat(receiverStore.page, receiverStore.receiverId);
    receiverStore.maxPage = newMessages.last_page;

    for (let i = 0; i < newMessages.data.length; i++) {
      messagesStore.allMessages[messagesStore.openedChatId].push(newMessages.data[i]);
    }
    scrollFinished = true;
  }
}
</script>

<template>
  <div class="wrapper">
    <ReceiverInfoComponent> </ReceiverInfoComponent>
    <div class="opened-chat" id="opened-chat" @scroll="getMoreMessages">
      <p v-if="messagesStore.openedChatId === 0" class="no-messages"> TODO: text from file using library, that in future
        I
        could translate
        easily
      </p>
      <div v-if="messagesStore.allMessages[messagesStore.openedChatId] !== undefined"
        v-for="message in messagesStore.allMessages[messagesStore.openedChatId]" :key="message.id"
        :class="message.user_id === loggedInUser.userId ? 'sent-message' : 'received-message'">
        <MessageComponent :message="message"> </MessageComponent>
      </div>
    </div>
    <SendMessageComponent> </SendMessageComponent>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.opened-chat {
  display: flex;
  overflow-y: scroll;
  flex-direction: column-reverse;
  flex: 1 1 auto;
  position: relative;
}

.opened-chat::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.05);
}

.opened-chat::-webkit-scrollbar-track {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.1);
}

.opened-chat::-webkit-scrollbar-thumb {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.5);
}

.sent-message {
  margin-left: auto;
}

.received-message {
  margin-right: auto;
}

.no-messages {
  position: absolute;
  top: 0;
  padding-left: 10px;
}
</style>
