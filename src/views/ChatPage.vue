<template>
  <div class="theWrapper">
    <div class="menu">
      <input class="search" placeholder="Search bar">
      <div class="chatHistory">
        <p v-if="!history.length">Chat list will be here as soon as you start one. Just write someone!</p>
        <div v-for="message in history" class="messageWrapper" v-on:click="openChat(message)">
          <div class="messagePicture"> Avatar </div>
          <div class="historyMessage">
            <h4 class="messageName"> {{ message.name }} </h4>
            <p class="message">{{ message.message }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapperChat">
      <div class="header">Other User info will be here</div>
      <div class="activeChat">
        <p v-if="!currentChat.length"> "There would be active chats. While nothing is opened channelchat, userchat &
          groupchat
          would be hidden. When
          you
          click on message on history one of them will be renderered with corresponding props to pass"</p>
        <div v-for="message in currentChat">{{ message.message }} </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { useCookies } from "vue3-cookies";
// import MessageComponent from "src/components/MessageComponent.vue";

const history = ref([]);
const { cookies } = useCookies();
onBeforeMount(async () => {
  const response = await fetch('http://localhost/api/message/history', {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    //TODO push to login page
    return
  }
  history.value = responseJSON;
})

const currentChat = ref([]);
async function openChat(message) {
  let link = '';
  switch (message.receiver_type) {
    case 'App\\Models\\Group':
      link = 'http://localhost/api/message/group-chat?page=1';
      break;
    case 'App\\Models\\Channel':
      link = 'http://localhost/api/message/channel-chat?page=1';
      break;
    default:
      link = 'http://localhost/api/message/chat-beetween-users?page=1';
  }
  const response = await fetch(link, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      receiver_id: message.receiver_id,
      sender_id: message.user_id,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    //TODO push to login page
    return
  }
  currentChat.value = responseJSON.data;
}
</script>

<style scoped>
div {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: #ffe;
}

input,
textarea {
  background: none;
  border: 0;
}

.messageName {
  margin: 0;
  padding: 0;
}

.message {
  margin-left: 10px;
}

.messagePicture {
  border: 1px solid black;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.historyMessage {
  border: 0;
  margin: 0;
  padding: 0;
}

.messageWrapper {
  display: flex;
}

.theWrapper {
  display: flex;
  height: 96vh;
  margin-bottom: 0;
}

.wrapperChat {
  width: 65%;
  display: flex;
  flex-direction: column;
}

.menu {
  display: flex;
  flex-direction: column;
  width: 30%;
}

.chatHistory {
  flex-grow: 1;
  overflow-y: scroll;
}

.chat {
  flex-grow: 1;
  overflow-y: scroll;
}

.search {
  margin: 10px;
  padding: 10px;
  border-bottom: 1px solid black;
}

.header {
  height: 10%;
}

.messageInput {
  margin: 10px;
  padding: 10px;
  flex-grow: 0;
  height: 75px;
  border: 1px solid black;
}
</style>
