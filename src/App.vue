<script setup>
import { RouterView } from 'vue-router';
import ErrorComponent from './components/detailsComponents/ErrorComponent.vue';
</script>

<template>
  <ErrorComponent />
  <RouterView />
</template>

<style lang="scss">
@import "@/styles/colours.scss";
body {
  margin: 0;
  padding: 0;
  position: relative;
}

html {
  height: 100%;
}

.border {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: var(--background-colour);
}
</style>
