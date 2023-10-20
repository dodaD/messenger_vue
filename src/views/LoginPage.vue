<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router'
const { cookies } = useCookies();
const router = useRouter();

import { useErrorStore } from '../stores/Error.js';
const errorStore = useErrorStore();

const email = ref('');
const password = ref('');

if (cookies.get("authToken") !== null) {
  router.push('/');
}

async function login() {
  const response = await fetch('http://localhost/api/user/login', {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  const responseJSON = await response.json();
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.message;
    return;
  }
  cookies.set("authToken", responseJSON);
  router.push('/');
}
</script>

<template>
  <div class="theWrapper">
    <h1> LOGIN </h1>
    <input v-model="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Password">
    <a href="http://localhost:2130/register">Don't have an account?</a>
    <button @click=login>Login</button>
  </div>
</template>

<style scoped>
div {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: #ffe;
}

.theWrapper {
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

