<template>
  <div class="theWrapper">
    <input v-model="email" placeholder="Email">
    <input v-model="name" placeholder="Name - how other people will know you">
    <input v-model="nickname" placeholder="Nickname - how people will find you">
    <input v-model="password" type="password" placeholder="Password">
    <input v-model="passwordRepeat" type="password" placeholder="Repeat Password">
    <a href="linkToLoginView">Already have an account?</a>
    <button @click=register>Register</button>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const email = ref('');
const name = ref('');
const nickname = ref('');
const password = ref('');
const passwordRepeat = ref('');

async function register() {
  if (password.value !== passwordRepeat.value) {
    //show error component
    console.log("Error!");
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
      nickname: nickname.value,
      password: Number(password.value)
    })
  })
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  cookies.set("authToken", responseJSON);
}
</script>

