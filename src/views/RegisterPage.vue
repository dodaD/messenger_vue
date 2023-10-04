<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router'
const { cookies } = useCookies();
const router = useRouter();

const email = ref('');
const name = ref(null);
const nickname = ref(null);
const password = ref('');
const passwordRepeat = ref(null);

async function register() {
  if (password.value !== passwordRepeat.value) {
    //show error component
    console.log("Error!");
    return;
  }
  if (!email.value || !name.value || !nickname.value || !password.value) {
    console.log("All fields must be filled!");
    return;
  }
  if (password.value.length < 8) {
    console.log("Password must be at least 8 characthers");
    return;
  }
  if (nickname.value.length >= 255 || name.value.length >= 255 || email.value.length >= 255) {
    console.log("Any fields shouldn't extends 255 characthers!");
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
      password: password.value
    })
  })
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  cookies.set("authToken", responseJSON);
  router.push('/');
}
</script>

<template>
  <div class="theWrapper">
    <h1> REGISTER </h1>
    <input v-model="email" placeholder="Email">
    <input v-model="name" placeholder="Name - how other people will know you">
    <input v-model="nickname" placeholder="Nickname - how people will find you">
    <input v-model="password" type="password" placeholder="Password">
    <input v-model="passwordRepeat" type="password" placeholder="Repeat Password">
    <a href="linkToLoginView">Already have an account?</a>
    <button @click=register>Register</button>
  </div>
</template>

<style scoped> div {
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

