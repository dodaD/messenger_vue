<script setup>
import { ref } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "@/stores/User";
const userStore = useUserStore();

const email = ref("");
const name = ref("");
// TODO  ??????
const nickname = ref("");
const password = ref("");
const repeatPassword = ref("");
const fieldsToFill = [
  { ref: email, errorProperty: 'email', fieldName: 'Email' },
  { ref: name, errorProperty: 'name', fieldName: 'Name' },
  { ref: nickname, errorProperty: 'nickname', fieldName: 'Nickname' },
  { ref: password, errorProperty: 'password', fieldName: 'Password' },
  { ref: repeatPassword, errorProperty: 'repeat_password', fieldName: 'Repeat Password' }
];

if (cookies.get("authToken") !== null) {
  router.push('/');
}

const validationErrors = ref({});
async function register() {
  validationErrors.value = await userStore.register(email.value, name.value, nickname.value, password.value, repeatPassword.value);
}

function deleteError(error) {
  const hasOwnProperty = validationErrors.value.hasOwnProperty(error);
  if (!hasOwnProperty) {
    return;
  }
  delete validationErrors.value[error];
}
</script>

<template>
  <div class="the-wrapper border">
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
        <input v-model="field.ref.value" maxlength="255" :class="{ has_error: validationErrors[field.errorProperty] }"
          @input="deleteError(field.errorProperty)" />
        <div class="errors-wrapper">
          <p v-for="error in validationErrors[field.errorProperty]" class="error-class">
            {{ error }}
          </p>
        </div>
      </div>
      <RouterLink to="/login">Already have an account?</RouterLink>
    </form>
    <button @click="register">Register</button>
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

.the-wrapper {
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

