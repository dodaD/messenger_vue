<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { useUserStore } from "../stores/user.js";
import { useOtherUserStore } from "../stores/otherUser.js";

const { cookies } = useCookies();
const currentUserStore = useUserStore();
const currentOtherUserStore = useOtherUserStore();

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
      nickname: nicknameToSearch.value,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(response);
    return;
  }
  seachResults.value = responseJSON;
}

async function openChat($receiver_id, $entity, $name, $nickname) {
  console.log("Place #2");
  let link = '';
  switch ($entity) {
    case 'group':
      link = 'http://localhost/api/message/group-chat?page=1';
      break;
    case 'channel':
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
      receiver_id: $receiver_id,
      sender_id: currentUserStore.userId,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    //TODO push to login page
    return;
  }
  currentUserStore.currentChat = responseJSON.data;
  currentOtherUserStore.otherUserId = $receiver_id;
  currentOtherUserStore.entity = $entity;
  currentOtherUserStore.userName = $name;
  currentOtherUserStore.userNickname = $nickname;
}
</script>

<template>
  <input class="search" placeholder="Search bar" v-model="nicknameToSearch" @input="search">
  <div v-for="result in seachResults" class="results">
    <p> {{ result.entity }}</p>
    <div @click="openChat(result.id, result.entity, result.name, result.nickname)">
      <div> {{ result.name }} </div>
      <div> {{ result.nickname }} </div>
    </div>
  </div>
</template>

<style scoped>
.results {
  z-index: 1;
}
</style>
