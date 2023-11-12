<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useCurrentReceiverStore } from "../stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

import { useErrorStore } from '../stores/Error.js';
const errorStore = useErrorStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { ref } from 'vue';

const nicknameToSearch = ref('');
const seachResults = ref([]);

async function search() {
  if (nicknameToSearch.value.length <= 2) {
    seachResults.value = [];
    return;
  }

  const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/search', { //TODO change to env variable 
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
  seachResults.value = responseJSON;
}

async function openChat(result) {
  const link = import.meta.env.VITE_APP_API_BASE_URL;
  let linkToChatPage = '';
  receiverStore.entity = result.entity;
  switch (result.entity) {
    case 'group':
      linkToChatPage = link + '/message/group-chat?page=1';
      break;
    case 'channel':
      linkToChatPage = link + '/message/channel-chat?page=1';
      break;
    default:
      linkToChatPage = link + '/chat-beetween-users?page=1';
  }
  const chatId = receiverStore.entity + result.id;
  receiverStore.receiverId = result.id;
  receiverStore.receiverName = result.name;
  receiverStore.receiverNickname = result.nickname;
  messagesStore.openedChatId = chatId;

  if (messagesStore.allMessages[chatId] !== undefined) {
    return;
  };

  const response = await fetch(linkToChatPage, {
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
    errorStore.errorMessage = responseJSON.error[0];
    return;
  }
  messagesStore.allMessages[chatId] = responseJSON.data.reverse();
  messagesStore.history.unshift(result);
}
</script>

<template>
  <input class="search border" placeholder="Search bar" v-model="nicknameToSearch" @input="search">
  <div class="search-wrapper" if="seachResults.length !== 0">
    <div @click="openChat(result)" v-for="result in seachResults" class="result border" if="seachResults.length !== 0">
      <div>
        <h4> {{ result.name }} </h4>
        <div> {{ result.nickname }} </div>
      </div>
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

.search-wrapper {
  max-height: 30vh;
  overflow: scroll;
  width: 100%;
  overflow-x: hidden;
}

.search-wrapper::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.05);
}

.search-wrapper::-webkit-scrollbar-track {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.1);
}

.search-wrapper::-webkit-scrollbar-thumb {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.5);
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
