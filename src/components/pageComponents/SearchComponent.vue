<script setup>
import { ref } from 'vue';
import { useSearchStore } from "@/stores/Search.js";

import { useCurrentReceiverStore } from "@/stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

const searchStore = useSearchStore();
const nicknameToSearch = ref('');

function openChat(result) {
  receiverStore.openChat(result.name, result.nickname, result.id);
}
</script>

<template>
  <input class="search border" placeholder="Search bar" v-model="nicknameToSearch"
    @input="searchStore.search(nicknameToSearch)">
  <div class="search-wrapper" if="searchStore.searchResults.length !== 0">
    <div @click="openChat(result)" v-for="result in searchStore.searchResults" class="result border">
      <div>
        <h4> {{ result.name }} </h4>
        <div> {{ result.nickname }} </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  z-index: 1;
  margin: 10px;
  display: flex;
}

h4 {
  margin: 0;
}

.search-wrapper {
  max-height: 30vh;
  overflow: scroll;
  width: 100%;
  overflow-x: hidden;
}

.search-wrapper::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.05);
}

.search-wrapper::-webkit-scrollbar-track {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.1);
}

.search-wrapper::-webkit-scrollbar-thumb {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.5);
}

.entity {
  width: fit-content;
  margin-bottom: 10px;
  border-bottom: 1px solid black;
}

.search {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid black;
  padding: 0;
  margin-right: 20%;
}
</style>
