<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
import { useUserStore } from "../stores/user.js";
import { useOtherUserStore } from "../stores/otherUser.js";
const currentUserStore = useUserStore();
const currentOtherUserStore = useOtherUserStore();

const newMessage = ref('');

async function sendMessage() {
  if (newMessage.value === '') {
    alert("You cannot send nothing :(");
    return;
  }
  const response = await fetch('http://localhost/api/message/add', {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      message: newMessage.value,
      receiver_id: currentOtherUserStore.otherUserId,
      receiver: currentOtherUserStore.entity,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  currentUserStore.currentChat.push(responseJSON);
  newMessage.value = '';
}
</script>

<template>
  <textarea v-model="newMessage"> {{ newMessage }} </textarea>
  <button v-on:click="sendMessage"> Send </button>
</template> 


