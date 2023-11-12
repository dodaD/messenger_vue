<script setup>
import { ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useMessagesStore } from '../stores/Messages';
const messagesStore = useMessagesStore();

import { useCurrentReceiverStore } from '../stores/CurrentReceiver';
const receiverStore = useCurrentReceiverStore();

import { useErrorStore } from '../stores/Error.js';
const errorStore = useErrorStore();

const newMessage = ref('');
async function sendMessage() {
  if (newMessage.value === '') {
    errorStore.errorMessage = 'Nothing to send';
    return;
  }
  if (receiverStore.receiverId === 0) {
    errorStore.errorMessage = 'No chat was selected';
    return;
  }
  const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/message/add', {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      message: newMessage.value,
      receiver_id: receiverStore.receiverId,
      receiver: receiverStore.entity,
    })
  });
  newMessage.value = '';
  const responseJSON = await response.json();
  if (response.status === 401) {
    clearInterval(messagesStore.intervalId);
    clearInterval(messagesStore.elementIntervalId);
    cookies.remove("authToken");
    messagesStore.intervalId = 0;
    router.push('/login');
  }
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.error[0];
    return;
  }
  messagesStore.allMessages[messagesStore.openedChatId].unshift(responseJSON);
  const historyChatId = messagesStore.history.findIndex(obj => {
    return obj.interlocutorId === receiverStore.receiverId && obj.receiver_type == responseJSON.receiver_type || obj.id === receiverStore.receiverId && obj.receiver_type === undefined;
  });
  messagesStore.history[historyChatId].message = responseJSON.message;
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

