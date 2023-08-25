<template>
  <div class="theWrapper">
    <div class="menu">
      <input class="search" placeholder="Search bar">
      <div class="chatHistory">
        <p v-if="!history.length">Chat list will be here as soon as you start one. Just write someone!</p>

        <div v-for="message in history" class="messageWrapper" v-on:click="openChat(message)">
          <div class="userPicture"> Avatar </div>
          <div class="historyMessage">
            <h4 class="messageName"> {{ message.name }} </h4>
            <p class="message">{{ message.message }}</p>
          </div>
        </div>
      </div>

      <div class="userWrapper">
        <div class="userPicture activeUser"> Avatar </div>
        <div class="userInfo">
          <h4> {{ currentUserInfo.name }} </h4>
          <div> {{ currentUserInfo.nickname }} </div>
          <div> {{ currentUserInfo.email }} </div>
        </div>
      </div>
    </div>

    <div class="wrapperChat">
      <div class="header">
        <h4> {{ otherUserInfo.name }} </h4>
        <div> {{ otherUserInfo.nickname }}
        </div>
      </div>
      <div class="activeChat">
        <p v-if="!currentChat.length"> "There would be active chats. While nothing is opened channelchat, userchat &
          groupchat
          would be hidden. When
          you
          click on message on history one of them will be renderered with corresponding props to pass"</p>
        <div v-for="message in currentChat" :key="message.id"
          :class="message.user_id === currentUserStore.userId ? 'sent-message' : 'received-message'">
          {{ message.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { useUserStore } from "../stores/user.js";
// import MessageComponent from "src/components/MessageComponent.vue";

const currentUserStore = useUserStore();

const history = ref([]);
const { cookies } = useCookies();
(async () => {
  const response = await fetch('http://localhost/api/message/history', {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    //TODO push to login page
    return
  }
  history.value = responseJSON;
})();

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
  getOtherUserInfo(currentChat.value[0].user_id, currentChat.value[0].receiver_id, currentChat.value[0].receiver_type);
}

const otherUserInfo = ref({});

async function getOtherUserInfo($user_id, $receiver_id, $receiver_type) {
  const id = currentUserStore === $user_id ? $user_id : $receiver_id;
  $receiver_type = $receiver_type.replace('App\\Models\\', '');

  const response = await fetch('http://localhost/api/user-info/' + id + '/' + $receiver_type, {
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    }
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    //TODO push to login page
    return;
  }
  otherUserInfo.value = responseJSON;
}

const currentUserInfo = ref([]);

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
    //TODO push to login page
    return;
  }
  currentUserInfo.value = responseJSON;
  currentUserStore.userId = currentUserInfo.value.id;
})();
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

.sent-message {
  margin-left: auto;
  width: fit-content;
}

.received-message {
  margin-right: auto;
  width: fit-content;
}

.userPicture {
  border: 1px solid black;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.activeUser {
  margin: 0;
  height: 70px;
  width: 70px;
  margin-top: auto;
  margin-bottom: auto;
}

.historyMessage {
  border: 0;
  margin: 0;
  padding: 0;
}

.messageWrapper,
.userWrapper {
  display: flex;
}

.userInfo {
  margin: 0;
  border: 0;
  padding-right: 0;
}

.userInfo div {
  margin: 0;
  margin-bottom: 3px;
  padding-left: 15px;
  margin-right: 5px;
  width: fit-content;
}

.userInfo h4 {
  margin: 0;
}

.userInfo div:last-of-type {
  padding-right: 20px;
  margin-left: 20px;
}

.userInfo div:first-of-type {
  position: relative;
  border-left: 0;
  margin-left: 3px;
}

.userInfo div:first-of-type::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-image: linear-gradient(to right, transparent, black);
  z-index: -1;
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

.header h4 {
  margin: 0;
}

.messageInput {
  margin: 10px;
  padding: 10px;
  flex-grow: 0;
  height: 75px;
  border: 1px solid black;
}
</style>
