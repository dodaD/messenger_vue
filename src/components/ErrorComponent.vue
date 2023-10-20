<script setup>
import { useErrorStore } from '../stores/Error.js';
const errorStore = useErrorStore();
</script>

<template>
  <div class="wrapper-1 border">
    {{ errorStore.errorMessage }}
  </div>
</template>

<style scoped>
.wrapper-1 {
  height: fit-content;
}

h3 {
  margin: 0;
}
</style>
