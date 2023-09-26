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
  console.log(messagesStore.allMessages);
  messagesStore.allMessages[messagesStore.openedChatId].push(responseJSON);
  const historyChatWithReceiverId = messagesStore.history.findIndex(obj => {
    return obj.interlocutorId === receiverStore.receiverId && obj.receiver_type == responseJSON.receiver_type;
  });
  messagesStore.history[historyChatWithReceiverId].message = responseJSON.message;
  newMessage.value = '';
}
</script>

<template>
  <div class="wrapper">
    <textarea v-model="newMessage"> {{ newMessage }} </textarea>
    <button v-on:click="sendMessage" class="send-button"> Send </button>
  </div>
</template> 

<style scoped>
.wrapper {
  bottom: 0;
  position: -webkit-sticky;
  /* Safari */
  position: sticky;
}

textarea {
  min-height: 40px;
}
</style>

