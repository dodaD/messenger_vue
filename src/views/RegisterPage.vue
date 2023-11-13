<script setup>
import { ref } from 'vue';

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useRouter } from 'vue-router';
const router = useRouter();

const email = ref('');
const name = ref(null);
const nickname = ref(null);
const password = ref('');
const passwordRepeat = ref(null);
const fieldsToFill = [
  { ref: email, errorProperty: 'email', fieldName: 'Email' },
  { ref: name, errorProperty: 'name', fieldName: 'Name' },
  { ref: nickname, errorProperty: 'nickname', fieldName: 'Nickname' },
  { ref: password, errorProperty: 'password', fieldName: 'Password' },
  { ref: passwordRepeat, errorProperty: 'repeat_password', fieldName: 'Repeat Password' }
];

if (cookies.get("authToken") !== null) {
  router.push('/');
}

const validationErrors = ref({});
async function register() {
  const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/user/register', {
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
  <div class="theWrapper border">
    <h1> REGISTER </h1>
    <form>
      <!--
        |----------------------------------------------------
        | TODOS
        |----------------------------------------------------
        |
        | TODO 1: have only one input in template 
        | TODO 2: all errors must be rendered via loop
        |
      -->

      <div v-for="field in fieldsToFill">
        <h4>{{ field.fieldName }} </h4>
        <input v-model="field.ref.value" maxlength="255" :class="{ has_error: validationErrors.email }" />
        <div class="errors-wrapper">
          <p v-for="error in validationErrors[field.errorProperty]" class="error-class">
            {{ error }}
          </p>
        </div>
      </div>
      <router-link to="/login">Already have an account?</router-link>
    </form>
    <button @click=register>Register</button>
  </div>
</template>

<style scoped>
h1,
button {
  margin-right: auto;
  margin-left: auto;
}

.errors-wrapper {
  display: flex;
  width: 100vh;
}

.has_error {
  border: red 1px solid;
}

.error-class {
  color: red;
}

p {
  margin: 0;
  padding: 0 5px;
}

p:first-of-type {
  padding-left: 0;
}

p:last-of-type {
  padding-right: 0;
}

.theWrapper {
  display: flex;
  min-height: 70vh;
  flex-direction: column;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 13vh;
  padding: 0 15%;
  justify-content: center;
  align-items: flex-start;
}

form {
  width: 72%;
  margin: 0 auto;
}

input {
  width: 100%;
}

a {
  margin-bottom: 10px;
  margin-right: auto;
}
</style>

