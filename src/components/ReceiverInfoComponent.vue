<script setup>
import { useCurrentReceiverStore } from "../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();
</script>

<template>
  <div class="wrapper-1 border">
    <div class="profile-picture" />
    <div class="info-wrapper">
      <h3 class="name"> {{ receiverStore.receiverName }} </h3>
      <div class="nickname"> {{ receiverStore.receiverNickname }} </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-1 {
  display: flex;
  height: fit-content;
  flex-direction: row;
}

.info-wrapper {
  margin: 10px;
}

h3 {
  margin: 0;
  margin-bottom: 5px;
}
</style>
