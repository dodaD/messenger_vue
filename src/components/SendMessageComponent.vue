<script setup>
import { ref } from 'vue';
import { useMessagesStore } from '@/stores/Messages';
const messagesStore = useMessagesStore();
const newMessage = ref('');

async function sendMessage() {
  await messagesStore.sendMessage(newMessage.value);
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

