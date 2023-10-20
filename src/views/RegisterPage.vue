<script setup>
import { ref } from 'vue';

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useErrorStore } from '../stores/Error.js';
const errorStore = useErrorStore();

const email = ref('');
const name = ref(null);
const nickname = ref(null);
const password = ref('');
const passwordRepeat = ref(null);

if (cookies.get("authToken") !== null) {
  router.push('/');
}

async function register() {
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value))) {
    errorStore.errorMessage = "Invalid email";
    return;
  }
  if (password.value !== passwordRepeat.value) {
    errorStore.errorMessage = "Passwords don't match";
    return;
  }
  if (!email.value || !name.value || !nickname.value || !password.value) {
    errorStore.errorMessage = "All fields must be filled";
    return;
  }
  if (password.value.length < 8) {
    errorStore.errorMessage = "Password must be at least 8 characthers";
    return;
  }
  if (nickname.value.length >= 255 || name.value.length >= 255 || email.value.length >= 255) {
    errorStore.errorMessage = "Any fields shouldn't extends 255 characthers";
    return;
  }
  const response = await fetch('http://localhost/api/user/register', {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      name: name.value,
      nickname: '@' + nickname.value,
      password: password.value
    })
  })
  const responseJSON = await response.json();
  if (!response.ok) {
    errorStore.errorMessage = responseJSON.error;
    return;
  }
  cookies.set("authToken", responseJSON);
  router.push('/');
}
</script>

<template>
  <div class="theWrapper">
    <h1> REGISTER </h1>
    Email
    <input v-model="email" placeholder="Email">
    Name <input v-model="name" placeholder="Name - how other people will know you">
    Nickname
    <input v-model="nickname" placeholder="Nickname - how people will find you">
    Passsword
    <input v-model="password" type="password" placeholder="Password">
    Repeat password<input v-model="passwordRepeat" type="password" placeholder="Repeat Password">
    <a href="http://localhost:2130/login">Already have an account?</a>
    <button @click=register>Register</button>
  </div>
</template>

<style scoped>
h1,
button {
  margin-right: auto;
  margin-left: auto;
}

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
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 13vh;
  padding: 0 15%;
  justify-content: center;
  align-items: flex-start;
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

