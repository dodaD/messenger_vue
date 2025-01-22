<script setup>
import ProfilePicture from '../components/detailsComponents/ProfilePictureComponent.vue';
import { useCurrentReceiverStore } from "../stores/CurrentReceiver.js";
const receiverStore = useCurrentReceiverStore();
</script>

<template>
  <div class="wrapper-1 border">
    <div class="history-button-for-mobile">
      <font-awesome-icon :icon="['fas', 'bars']" />
    </div>

    <div class="receiver-full-info-wrapper">
      <ProfilePicture />
      <div class="info-wrapper">
        <h3 class="name"> {{ receiverStore.receiverName }} </h3>
        <div class="nickname"> {{ receiverStore.receiverNickname }} </div>
      </div>
    </div>

    <div class="logout-button-for-mobile">
      <font-awesome-icon :icon="['fas', 'person-running']" />
      <font-awesome-icon :icon="['fas', 'door-open']" class="door-open" />
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

.receiver-full-info-wrapper {
  display: flex;
}

@media (max-width:600px) {
  .wrapper-1 {
    margin: 0;
    border: 2px solid var(--border-colour);
  }

  .logout-button-for-mobile,
  .history-button-for-mobile {
    font-size: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--accent-colour);
    margin: 0 10px;
  }

  .door-open {
    transform: rotateY(180deg);
  }

  .receiver-full-info-wrapper {
    margin: auto;
  }
}
</style>
