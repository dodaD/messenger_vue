<script setup>
import { ref } from 'vue';

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useMessagesStore } from '../stores/Messages';
const messagesStore = useMessagesStore();

import { useCurrentReceiverStore } from '../stores/CurrentReceiver';
const receiverStore = useCurrentReceiverStore();

const newMessage = ref('');
async function sendMessage() {
  if (newMessage.value === '') {
    alert("You cannot send nothing :(");
    return;
  }
  const response = await fetch('http://localhost/api/message/add', {
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
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  messagesStore.allMessages[messagesStore.openedChatId].unshift(responseJSON);
  const historyChatId = messagesStore.history.findIndex(obj => {
    return obj.interlocutorId === receiverStore.receiverId && obj.receiver_type == responseJSON.receiver_type || obj.id === receiverStore.receiverId && obj.receiver_type === undefined;
  });
  messagesStore.history[historyChatId].message = responseJSON.message;
  newMessage.value = '';
}
</script>

<template>
  <div class="wrapper-1">
    <textarea v-model="newMessage" class="send-message"
      oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' />
    <button v-on:click="sendMessage" class="send-button"> Send </button>
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

