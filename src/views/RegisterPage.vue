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
<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { useRouter } from 'vue-router'
const { cookies } = useCookies();
const router = useRouter();

const email = ref(null);
const name = ref(null);
const nickname = ref(null);
const password = ref(null);
const passwordRepeat = ref(null);

async function register() {
  if (password.value !== passwordRepeat.value) {
    //show error component
    console.log("Error!");
    return;
  } else if (!email.value || !name.value || !nickname.value || !password.value) {
    console.log("All fields must be filled!");
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

<style scoped> div {
   border: 1px solid black;
   margin: 10px;
   padding: 10px;
   background-color: #ffe;
 }

 .theWrapper {
   display: flex;
   height: 96vh;
   margin-bottom: 0;
   flex-direction: column;
   align-items: center;
   justify-content: center;
 }

 input {
   width: 60%;
   height: 23px;
   margin: 11px 0;
 }
</style>

