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

.input-style {
  background-color: transparent;
  border: none;
  padding: 0;
  width: 100%;
  height: 25px;
  border-bottom: 1px solid var(--border-colour);
  color: var(--font-colour);
}
</style>
