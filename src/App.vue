<script setup>
import { RouterView } from 'vue-router';
import ErrorComponent from './components/detailsComponents/ErrorComponent.vue';
</script>

<template>
  <ErrorComponent />
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
</style>
