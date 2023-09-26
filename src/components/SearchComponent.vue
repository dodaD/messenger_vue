<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import { ref } from 'vue';

const nicknameToSearch = ref('');
const seachResults = ref([]);

async function search() {
  const response = await fetch('http://localhost/api/search', { //TODO change to env variable 
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      nickname: nicknameToSearch.value,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(response);
    return;
  }
  seachResults.value = responseJSON;
}

</script>

<template>
  <input class="search" placeholder="Search bar" v-model="nicknameToSearch" @input="search">
  <div v-for="result in seachResults" class="results">
    <p> {{ result.entity }}</p>
    <div @click="messagesStore.history.unshift(result)">
      <div> {{ result.name }} </div>
      <div> {{ result.nickname }} </div>
    </div>
  </div>
</template>

<style scoped>
.results {
  z-index: 1;
}
</style>
