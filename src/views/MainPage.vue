<script setup>
import OpenedChatComponent from "../components/OpenedChatComponent.vue";
import HistoryComponent from "../components/HistoryComponent.vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();

(async () => {
  const response = await fetch('http://localhost/api/user/my-user-info', {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    return;
  }
  loggedInUser.userId = responseJSON.id; //TODO put it in more suitable place; my profile for example
})();

</script>

<template>
  <div class="wrapper border">
    <div class="menu">
      <div class="chat-history border">
        <HistoryComponent> </HistoryComponent>
      </div>
    </div>

    <div class="border chat">
      <OpenedChatComponent> </OpenedChatComponent>
    </div>
  </div>
</template>


<style scoped>
.wrapper {
  display: flex;
  height: 95vh;
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
  min-width: 30%;
  width: fit-content;
}

.chat-history {
  flex-grow: 1;
  overflow-y: scroll;
}

.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
