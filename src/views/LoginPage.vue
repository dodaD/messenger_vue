<script setup>
import { ref } from 'vue';

import { useUserStore } from '../stores/User.js';
const userStore = useUserStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useRouter } from 'vue-router'
const router = useRouter();

const email = ref('');
const password = ref('');

if (cookies.get("authToken") !== null) {
  router.push('/');
}

</script>

<template>
  <div class="the-wrapper ">
    <h1> LOGIN </h1>
    <input v-model="email" placeholder="Email" @keyup.enter="userStore.login(email, password)" class="input-style">
    <input v-model="password" type="password" placeholder="Password" @keyup.enter="userStore.login(email, password)"
      class="input-style">
    <RouterLink to="/register">Don't have an account?</RouterLink>
    <button @click="userStore.login(email, password)">Login</button>
  </div>
</template>

<style scoped>
div {
  border: 1px solid var(--border-colour);
  margin: 10px;
  padding: 10px;
  background-color: var(--background-colour);
}

.the-wrapper {
  display: flex;
  height: 70vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 13vh;
  padding: 0 15%;
}

input {
  width: 100%;
  height: 23px;
  margin: 11px 0;
}

a {
  margin-bottom: 10px;
  margin-right: auto;
}
</style>
