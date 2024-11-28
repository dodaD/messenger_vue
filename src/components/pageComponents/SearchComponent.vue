<script setup>
import { ref } from 'vue';
import { useSearchStore } from "@/stores/Search.js";

import { useCurrentReceiverStore } from "@/stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

const searchStore = useSearchStore();
const nicknameToSearch = ref('');

function openChat(result) {
  searchStore.searchResults = [];
  receiverStore.openChat(result.name, result.nickname, result.id);
}

function clearSearch() {
  searchStore.searchResults = [];
  nicknameToSearch.value = '';
}
</script>

<template>
  <div class="search-input-wrapper">
    <input class="search" placeholder="Search bar" v-model="nicknameToSearch"
      @input="searchStore.search(nicknameToSearch)">

    <font-awesome-icon :icon="['fas', 'circle-xmark']" @click="clearSearch" class="clearSearchButton" />
  </div>

  <div class="results-wrapper" v-if="searchStore.searchResults.length !== 0">
    <div @click="openChat(result)" :key="result.nickname" v-for="result in searchStore.searchResults" class="result">
      <div>
        <h4> {{ result.name }} </h4>
        <div> {{ result.nickname }} </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  border: 1px solid black;
  margin-right: 2px;
  margin-bottom: 10px;
  padding: 5px;
}

h4 {
  margin: 0;
}

.results-wrapper {
  margin-top: 5px !important;
  max-height: 30vh;
  overflow: scroll;
  max-width: 100%;
  overflow-x: hidden;
  margin: 10px;
  min-height: 60px;
}

.results-wrapper::-webkit-scrollbar {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.05);
}

.results-wrapper::-webkit-scrollbar-track {
  width: 1px;
  background-color: rgba(10, 10, 10, 0.1);
}

.results-wrapper::-webkit-scrollbar-thumb {
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
  padding: 0;
  width: 100%;
  height: 20px;
}

.search-input-wrapper {
  overflow-x: hidden;
  position: relative;
  height: 30px;
  margin: 10px;
  border-bottom: 1px solid black;
}

.clearSearchButton {
  position: absolute;
  right: 0;
  bottom: 50%;
  transform: translateX(100%);
  transform: translateY(50%);
  height: 15px;
}

textarea:focus,
input:focus {
  outline: none;
}

p {
  margin: 0;
  padding: 0;
}
</style>
