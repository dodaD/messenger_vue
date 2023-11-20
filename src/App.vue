<script setup>
import { RouterView } from 'vue-router';
import ErrorComponent from './components/detailsComponents/ErrorComponent.vue';
</script>

<template>
  <ErrorComponent />
  <RouterView />
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
</style>
