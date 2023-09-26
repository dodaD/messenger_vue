<script setup>
import { useCurrentReceiverStore } from "../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

async function getInfo() {
  const id = receiverStore.receiverId;
  const receiverType = receiverStore.entity;
  const response = await fetch(`http://localhost/api/user-info/${id}/${receiverType}`, {
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
  console.log(responseJSON.name);
  receiverStore.receiverName = responseJSON.name;
  receiverStore.receiverNickname = responseJSON.nickname;
}; 
</script>

<template>
  <div>
    <div class="name"> {{ receiverStore.receiverName }} </div>
    <div class="nickname"> {{ receiverStore.receiverNickname }} </div>
    <div class="profile-picture"> </div>
  </div>
</template>
