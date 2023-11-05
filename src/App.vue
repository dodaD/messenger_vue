<script setup>
import { RouterView } from 'vue-router';
import ErrorComponent from './components/ErrorComponent.vue';

import { useErrorStore } from './stores/Error.js';
const errorStore = useErrorStore();
</script>

<template>
  <ErrorComponent v-if="errorStore.errorMessage !== ''" class="error-message"> </ErrorComponent>
  <RouterView> </RouterView>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  position: relative;
}

html {
  height: 100%;
}

.profile-picture {
  border: 1px solid black;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.error-message {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
