<script setup>
import ProfilePicture from '../components/detailsComponents/ProfilePictureComponent.vue';
import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();

loggedInUser.getUserInfo();
</script>

<template>
  <div class="wrapper border">
    <div class="info-wrapper">
      <div class="name"> {{ loggedInUser.userName }} </div>
      <div class="nickname"> {{ loggedInUser.userNickname }} </div>
      <div class="email"> {{ loggedInUser.userEmail }} </div>
    </div>
    <ProfilePicture />
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

.wrapper {
  display: flex;
  height: fit-content;
}

.info-wrapper {
  margin-right: auto;
}
</style>
