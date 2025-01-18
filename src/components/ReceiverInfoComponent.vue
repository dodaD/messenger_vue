<script setup>
import ProfilePicture from '../components/detailsComponents/ProfilePictureComponent.vue';
import { useCurrentReceiverStore } from "../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();
</script>

<template>
  <div class="wrapper-1 border">
    <ProfilePicture />
    <div class="info-wrapper">
      <h3 class="name"> {{ receiverStore.receiverName }} </h3>
      <div class="nickname"> {{ receiverStore.receiverNickname }} </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

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

@media (max-width:600px) {
  .wrapper-1 {
    margin: 0;
    border: 2px solid var(--border-colour);
  }
}
</style>
