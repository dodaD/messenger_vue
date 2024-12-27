<script setup>
import { ref } from "vue";

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "@/stores/User";
const userStore = useUserStore();

if (cookies.get("authToken") !== null) {
  router.push('/');
}

const fieldsToFill = [
  { value: "", errorProperty: 'email', fieldName: 'Email', type: 'text' },
  { value: "", errorProperty: 'name', fieldName: 'Name', type: 'text' },
  { value: "", errorProperty: 'nickname', fieldName: 'Nickname', type: 'text' },
  { value: "", errorProperty: 'password', fieldName: 'Password', type: 'password' },
  { value: "", errorProperty: 'repeat_password', fieldName: 'Repeat Password', type: 'password' }
];

function getValueOfField(field) {
  const key = Object.keys(fieldsToFill).find(key =>
    fieldsToFill[key].fieldName === field);
  return fieldsToFill[key].value;
}

const validationErrors = ref({});
async function register() {
  validationErrors.value = await userStore.register(getValueOfField('Email'),
    getValueOfField('Name'),
    getValueOfField('Nickname'),
    getValueOfField('Password'),
    getValueOfField('Repeat Password')
  );
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
      <div v-for="field in fieldsToFill" :key="field.fieldName">
        <h4>{{ field.fieldName }} </h4>
        <input v-model="field.value" maxlength="255" :type="field.type"
          :class="{ has_error: validationErrors[field.errorProperty] }" @input="deleteError(field.errorProperty)"
          @keyup.enter="register" />
        <div class="errors-wrapper">
          <p v-for="error in validationErrors[field.errorProperty]" class="error-class" :key="error">
            {{ error }}
          </p>
        </div>
      </div>

      <div class="link">
        <RouterLink to="/login">Already have an account?</RouterLink>
      </div>
    </form>
    <button @click="register">Register</button>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

h1,
button {
  margin-right: auto;
  margin-left: auto;
}

.errors-wrapper {
  display: flex;
  flex-direction: column;
  width: 100vh;
}

.has_error {
  border: var(--error-colour) 1px solid;
}

.error-class {
  color: var(--error-colour);
}

p {
  margin: 0;
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
  border: var(border-colour) 1px solid;
}

.link {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: auto;
}
</style>
