<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();
import { useErrorStore } from '../stores/Error.js';

const errorStore = useErrorStore();
import { ref } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { defineProps } from 'vue';
const props = defineProps({
  message: Object,
  chatId: String,
});

const updatedAt = ref('');
const date = ref(new Date(props.message.updated_at));
const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
updatedAt.value = date.value.toLocaleString('en-US', options);

const show = ref(true);
const updatedMessage = ref(props.message.message);
const allowedToClick = props.message.user_id === loggedInUser.userId;

async function editMessage() {
  if (allowedToClick === false) {
    errorStore.errorMessage = 'You are not allowed to edit this message';
    return;
  }

  const response = await fetch('http://localhost/api/message/edit/' + props.message.id, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      message: updatedMessage.value,
    })
  });
  const responseJSON = await response.json();
  if (response.status === 401) {
    cookies.remove("authToken");
    router.push('/login');
  }
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.error;
    return;
  }
  show.value = true;
  const arr = messagesStore.allMessages[messagesStore.openedChatId];
  let messageToChangeId = arr.findIndex((message) => message.id === props.message.id);
  if (updatedMessage.value === arr[messageToChangeId].message) {
    return;
  }
  arr[messageToChangeId].message = updatedMessage.value; //TODO change
  date.value = new Date(responseJSON.updated_at);
  updatedAt.value = date.value.toLocaleString('en-US', options);
  arr[messageToChangeId].updated_at = updatedAt.value;
}

async function deleteMessage() {
  if (allowedToClick === false) {
    errorStore.errorMessage = 'You are not allowed to delete this message';
    return;
  }
  const response = await fetch('http://localhost/api/message/' + props.message.id, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
  });
  const responseJSON = await response.json();
  if (response.status === 401) {
    cookies.remove("authToken");
    router.push('/login');
  }
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.error;
    return;
  } //TODO short it
  messagesStore.allMessages[messagesStore.openedChatId] = messagesStore.allMessages[messagesStore.openedChatId].filter(message => message.id !== props.message.id);
}
</script>

<template>
  <div v-if="show" class="border message">
    <div> {{ props.message.reference_message }} </div>
    {{ props.message.message }}
    <div v-if="props.message.updated_at !== props.message.created_at">Updated: {{ updatedAt }}</div>
  </div>
  <button v-if="show && allowedToClick" @click="show = !show">E</button>
  <button v-if="show && allowedToClick" @click=deleteMessage>D</button>
  <div class="border" v-if="!show">
    <textarea v-model="updatedMessage" class="changing" />
    <button v-if="!show" @click=editMessage class="save-changes-button">Save</button>
  </div>
</template> 

<style scoped>
button {
  height: 20px;
  min-width: 20px;
  width: fit-content;
}

.border {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
}

.changing {
  border: none;
  background-color: transparent;
  border-bottom: 1px solid purple;
  margin: 0;
  width: fit-content;
  height: 20px;
  resize: none;
}

.save-changes-button {
  width: fit-content;
  margin: 0 5px;
}

.message {
  width: fit-content;
}
</style>
