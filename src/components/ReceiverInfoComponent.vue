<script setup>
import { useCurrentReceiverStore } from "../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();
</script>

<template>
  <div class="border">
    <div class="name"> {{ receiverStore.receiverName }} </div>
    <div class="nickname"> {{ receiverStore.receiverNickname }} </div>
    <div class="profile-picture"> </div>
  </div>
</template>
