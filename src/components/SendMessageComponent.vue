<script setup>
import { ref } from 'vue';
import { useMessagesStore } from '@/stores/Messages';
import { useCurrentReceiverStore } from '@/stores/CurrentReceiver';
const messagesStore = useMessagesStore();
const receiverStore = useCurrentReceiverStore();
const newMessage = ref('');

async function sendMessage() {
  await messagesStore.sendMessage(newMessage.value);

  const historyChatId = messagesStore.history.findIndex(obj => {
    return obj.interlocutorId === receiverStore.receiverId;
    //  TODO: when different entities also check for them too
    //  Ex: ... && obj.receiver_type == receiverStore.entity
  });
  if (historyChatId !== 0) {
    const currentChat = messagesStore.history.splice(historyChatId, 1);
    messagesStore.history.unshift(currentChat[0]);
  }
  newMessage.value = "";
}
</script>

<template>
  <div class="wrapper-1">
    <textarea v-model="newMessage" id="wrapper-1" class="send-message" @keydown.enter.prevent="sendMessage"
      oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' />
    <button @click="sendMessage" class="send-button"> Send </button>
  </div>
</template>

<style scoped>
.wrapper-1 {
  margin-top: 5px;
  height: fit-content;
  display: flex;
  width: 100%;
}

.send-message {
  max-height: 130px;
  min-height: 75px;
  height: 100%;
  resize: none;
  width: 85%;
}

.send-button {
  width: 10%;
  height: fit-content;
  margin: auto;
}
</style>
