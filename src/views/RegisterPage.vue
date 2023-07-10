<template> 
<div class="theWrapper">
  <input v-model="email" placeholder="Email">
  <input v-model="name" placeholder="Name - how other people will know you">
  <input v-model="nickname" placeholder="Nickname - how people will find you">
  <input v-model="password" placeholder="Password">
  <input v-model="passwordRepeat" placeholder="Repeat Password">
  <a href="linkToLoginView">Already have an account?</a>
</div>
</template>
<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";

function register() {
    if( password.value !== passwordRepeat ) {
      //show error component
      console.log("Error!");
      return;
    }
    fetch('http://localhost/api/user/register', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
          email: email.value,
          name: name.value,
          nickname: nickname.value,
          password: password.value,
      })
    })
}
</script>

