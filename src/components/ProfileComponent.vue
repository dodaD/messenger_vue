<script setup>
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();

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
    return;
  }
  loggedInUser.userId = responseJSON.id;
  loggedInUser.userName = responseJSON.name;
  loggedInUser.userNickname = responseJSON.nickname;
  loggedInUser.userEmail = responseJSON.email;
})();
</script>

<template>
  <div class="wrapper border">
    <div class="info-wrapper">
      <div class="name"> {{ loggedInUser.userName }} </div>
      <div class="nickname"> {{ loggedInUser.userNickname }} </div>
      <div class="email"> {{ loggedInUser.userEmail }} </div>
    </div>
    <div class="profile-picture"> </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: fit-content;
  position: absolute;
  bottom: 0;
}
</style>
