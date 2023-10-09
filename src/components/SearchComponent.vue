<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useCurrentReceiverStore } from "../stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { ref } from 'vue';

const nicknameToSearch = ref('');
const seachResults = ref([]);

async function search() {
  const response = await fetch('http://localhost/api/search', { //TODO change to env variable 
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      nickname: '@' + nicknameToSearch.value,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(response);
    return;
  }
  seachResults.value = responseJSON;
}

async function openChat(result) {
  let link = '';
  receiverStore.entity = result.entity;
  switch (result.entity) {
    case 'group':
      link = 'http://localhost/api/message/group-chat?page=1';
      break;
    case 'channel':
      link = 'http://localhost/api/message/channel-chat?page=1';
      break;
    default:
      link = 'http://localhost/api/message/chat-beetween-users?page=1';
  }
  const chatId = receiverStore.entity + result.id;
  receiverStore.receiverId = result.id;
  receiverStore.receiverName = result.name;
  receiverStore.receiverNickname = result.nickname;
  messagesStore.openedChatId = chatId;

  if (messagesStore.allMessages[chatId] !== undefined) {
    return;
  };

  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      receiver_id: result.id,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  messagesStore.allMessages[chatId] = responseJSON.data.reverse();
  messagesStore.history.unshift(result);
}
</script>

<template>
  <input class="search border" placeholder="Search bar" v-model="nicknameToSearch" @input="search">
  <div v-for="result in seachResults" class="result border" if="!seachResults">
    <div @click="openChat(result)">
      <h4> {{ result.name }} </h4>
      <div> {{ result.nickname }} </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  z-index: 1;
  margin: 10px;
  display: flex;
}

h4 {
  margin: 0;
}

.entity {
  width: fit-content;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}

.search {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  padding: 0;
  margin-right: 20%;
}
</style>
