<script setup>
import { useErrorStore } from '../../stores/Error.js';
const errorStore = useErrorStore();
</script>

<template>
  <div v-if="errorStore.errorMessages.length" class="wrapper-1 error-message">
    <div v-for="e in errorStore.errorMessages" class="border">
      {{ e }}
    </div>
  </div>
</template>

<style scoped>
.wrapper-1 {
  height: fit-content;
}

h3 {
  margin: 0;
}

.error-message {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
