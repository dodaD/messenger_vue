<script setup>
import OpenedChatComponent from "../components/OpenedChatComponent.vue";
import HistoryComponent from "../components/HistoryComponent.vue";
import ProfileComponent from "../components/ProfileComponent.vue";
import SearchComponent from "../components/SearchComponent.vue";

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
      <SearchComponent> </SearchComponent>
      <div class="chat-history border">
        <HistoryComponent> </HistoryComponent>
      </div>
      <ProfileComponent> </ProfileComponent>
    </div>

    <div class="border chat">
      <OpenedChatComponent> </OpenedChatComponent>
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

.chat-history {
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  height: 100%;
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
