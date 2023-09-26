<script setup>
import OpenedChatComponent from "../components/OpenedChatComponent.vue";
import HistoryComponent from "../components/HistoryComponent.vue";
import ProfileComponent from "../components/ProfileComponent.vue";
import SearchComponent from "../components/SearchComponent.vue";
</script>

<template>
  <div class="theWrapper border">
    <div class="menu">
      <div class="chat-history border">
        <SearchComponent> </SearchComponent>
        <HistoryComponent> </HistoryComponent>
        <ProfileComponent> </ProfileComponent>
      </div>
    </div>

    <div class="border chat">
      <OpenedChatComponent> </OpenedChatComponent>
    </div>
  </div>
</template>


<style scoped>
.theWrapper {
  display: flex;
  height: 95vh;
}

.border {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: #ffe;
}

.menu {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  /*TODO decide whether I want fixated width for menu or for chat*/
  min-width: 30%;
  width: fit-content;
}

.chat-history {
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
}

.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
