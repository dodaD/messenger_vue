<script setup>
import { RouterView } from 'vue-router';
import ErrorComponent from './components/detailsComponents/ErrorComponent.vue';
</script>

<template>
  <ErrorComponent />
  <RouterView />
</template>

<style lang="scss">
@import 'styles/colours.scss';

body {
  margin: 0;
  padding: 0;
  position: relative;
  background: var(--background-colour);
  color: var(--font-colour);
}

html {
  height: 100%;
}

.border {
  border: 1px solid var(--border-colour);
  margin: 10px;
  padding: 10px;
}
</style>
