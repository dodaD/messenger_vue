<script setup>
import OpenedChatComponent from "../components/pageComponents/OpenedChatComponent.vue";
import HistoryComponent from "../components/pageComponents/HistoryComponent.vue";
import SearchComponent from "../components/pageComponents/SearchComponent.vue";
import ProfileComponent from "../components/ProfileComponent.vue";

import { useRouter } from 'vue-router';
const router = useRouter();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

function logOut() {
  clearInterval(messagesStore.intervalId);
  clearInterval(messagesStore.elementIntervalId);
  cookies.remove("authToken");
  messagesStore.intervalId = 0;
  router.push('/login');
}
</script>

<template>
  <button v-if="cookies.get('authToken') !== null" class="logout-button" @click="logOut">Log Out </button>
  <div class="theWrapper border">
    <div class="menu">
      <SearchComponent />
      <div class="chat-history border">
        <HistoryComponent />
      </div>
      <ProfileComponent />
    </div>

    <div class="border chat">
      <OpenedChatComponent />
    </div>
  </div>
</template>


<style scoped>
.theWrapper {
  display: flex;
  height: 95vh;
  max-width: 80%;
  margin-right: auto !important;
  margin-left: auto !important;
}

.border {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: #ffe;
}

.menu {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /*TODO decide whether I want fixated width for menu or for chat*/
  width: 30%;
}

.search-component {
  height: 30vh;
  background-color: red;
}

.chat-history {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-x: hidden;
}

.chat-history::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.05);
}

.chat-history::-webkit-scrollbar-track {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.1);
}

.chat-history::-webkit-scrollbar-thumb {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.5);
}


.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.logout-button {
  right: 10px;
  position: absolute;
}
</style>
