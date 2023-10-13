<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  errorMessage: String,
});

</script>

<template>
  <div class="wrapper-1 border">
    {{ props.errorMessage }}
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
