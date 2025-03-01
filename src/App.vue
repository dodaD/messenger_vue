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

input:-webkit-autofill,
input:-webkit-autofill:focus {
  transition: background-color 0s 600000s, color 0s 600000s !important;
}

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

button {
  border-radius: 15px;
  height: 30px;
  background-color: var(--accent-colour);
  border: none;
  color: var(--font-colour);
  padding: 0px 10px
}

@media (max-width:600px) {
  body {
    height: 100%;
    overflow-x: hidden;
  }

  .border {
    margin-top: 0;
  }

  #app {
    height: calc(100% - 20px);
    padding-top: 10px;
    box-sizing: border-box;
  }

  .the-wrapper {
    height: 100%;
    box-sizing: border-box;
    margin: 0;
    border: 0;
    padding: 0;
  }

  .first-message {
    .hover-check {
      .message {
        .hidden-menu {
          transform: translate(0, calc(-100% - 5px));
        }
      }
    }
  }

}
</style>
