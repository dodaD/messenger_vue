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
import { ref } from "vue";
const scrollFinished = ref(true);
const showScrollDownButton = ref(false);

async function getMoreMessages(event) {
  let scrollHeight = (event.target.scrollTop - event.target.clientHeight) * 0.95;

  if (event.target.scrollTop === 0) {
    scrollFinished.value = true;
    showScrollDownButton.value = false;
  }

  if ((-1 * event.target.scrollTop) <= ((document.querySelector('.opened-chat').scrollHeight) * 0.05)) {
    showScrollDownButton.value = false;
  } else {
    showScrollDownButton.value = true;
  }

  if (-1 * event.target.scrollTop > scrollHeight && scrollFinished) {
    scrollFinished.value = false;
    if (receiverStore.page >= receiverStore.maxPage && receiverStore.maxPage !== 0) {
      return;
    }
    receiverStore.page++;

    const newMessages = await messagesStore.getMessagesFromChat(receiverStore.page, receiverStore.receiverId);
    receiverStore.maxPage = newMessages.last_page;

    for (let i = 0; i < newMessages.data.length; i++) {
      messagesStore.allMessages[messagesStore.openedChatId].push(newMessages.data[i]);
    }
    scrollFinished.value = true;
  }
}

function scrollDown() {
  document.querySelector('.opened-chat').scrollBy(0, document.querySelector('.opened-chat').scrollHeight + 20);
  messagesStore.howManyNewMessages = 0;
}

const editingMessageId = ref(null);
const isAllowedToEdit = ref(false);
const originalMessage = ref('');
function openEdit(allowedToEdit, id, message) {
  isAllowedToEdit.value = allowedToEdit;
  editingMessageId.value = id;
  originalMessage.value = message;
}

function clearEditProps() {
  isAllowedToEdit.value = false;
  editingMessageId.value = null;
  originalMessage.value = '';
}
</script>

<template>
  <div class="wrapper">
    <ReceiverInfoComponent> </ReceiverInfoComponent>
    <div class="opened-chat" id="opened-chat" @scroll="getMoreMessages">

      <div class="round-button-to-scroll-down" v-if="showScrollDownButton" @click="scrollDown">
        <div v-if="messagesStore.howManyNewMessages !== 0" class="circle-with-number-of-new-messages"> {{
          messagesStore.howManyNewMessages }} </div>
        <font-awesome-icon :icon="['fas', 'angle-down']" />
      </div>

      <p v-if="messagesStore.openedChatId === 0" class="no-messages"> TODO: text from file using library, that in future
        I
        could translate
        easily
      </p>

      <div v-if="messagesStore.allMessages[messagesStore.openedChatId] !== undefined"
        v-for="message in messagesStore.allMessages[messagesStore.openedChatId]" :key="message.id"
        :class="message.user_id === loggedInUser.userId ? 'sent-message' : 'received-message'">
        <MessageComponent :message="message" @editing="openEdit" />
      </div>
    </div>

    <SendMessageComponent :editingMessageId="editingMessageId" :originalMessage="originalMessage"
      :isAllowedToEdit="isAllowedToEdit" @finishedEditing="clearEditProps" />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

.round-button-to-scroll-down {
  position: fixed;
  top: calc(0.9 * 90vh);
  right: 10%;
  transform: translateX(-85%);
  /* This is just looks good
  * but logic should be like something beneath it
 */
  /*calc(-100% + 10px)*/
  width: 40px;
  height: 40px;
  background-color: var(--accent-colour);
  border-radius: 100%;
  border: 1px var(--border-colour) solid;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.circle-with-number-of-new-messages {
  border: 1px var(--border-colour) solid;
  background-color: var(--semi-accent-colour);
  position: absolute;
  top: 0;
  right: 0;
  transform: translateY(-25%) translateX(25%);
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
}

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
  margin-bottom: 20px;
  margin-right: 10px;
  margin-left: 10px;

  .sent-message,
  .received-message {
    margin-top: 10px;
  }
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
