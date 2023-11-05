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

const validationErrors = ref({});
async function register() {

  const response = await fetch('http://localhost/api/user/register', {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      name: name.value,
      nickname: '@' + nickname.value,
      password: password.value,
      repeat_password: passwordRepeat.value,
    })
  })
  const responseJSON = await response.json();
  if (!response.ok) {
    validationErrors.value = responseJSON.error;
    return;
  }
  cookies.set("authToken", responseJSON);
  router.push('/');
}
</script>

<template>
  <div class="theWrapper">
    <h1> REGISTER </h1>
    <form>
      <h4>Email</h4>
      <input v-model="email" maxlength="255" placeholder="Email" :class="{ has_error: validationErrors.email }">
      <!--
        |----------------------------------------------------
        | TODOS
        |----------------------------------------------------
        |
        | TODO 1: have only one input in template 
        | TODO 2: all errors must be rendered via loop
        |
      -->
      <p>{{ validationErrors.email }} </p>
      <h4>Name</h4>
      <input v-model="name" maxlength="255" placeholder="Name - how other people will know you">
      <h4>Nickname</h4>
      <input v-model="nickname" maxlength="255" placeholder="Nickname - how people will find you"
        :class="{ has_error: validationErrors.nickname }">
      <p>{{ validationErrors.nickname }} </p>
      <h4>Password</h4>
      <input v-model="password" type="password" maxlength="255" placeholder="Password"
        :class="{ has_error: validationErrors.password }">
      <p>{{ validationErrors.password }} </p>
      <h4>Repeat Password</h4>
      <input v-model="passwordRepeat" type="password" maxlength="255" placeholder="Repeat Password"
        :class="{ has_error: validationErrors.password }">
      <p>{{ validationErrors.repeat_password }} </p>
    </form>
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

.has_error {
  border: red 1px solid;
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
  width: 250px;
  height: 23px;
  margin: 11px 0;
}

a {
  margin-bottom: 10px;
  margin-right: auto;
}
</style>

