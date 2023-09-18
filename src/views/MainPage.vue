<script setup>
import OpenedChatComponent from "../components/OpenedChatComponent.vue"
import HistoryComponent from "../components/HistoryComponent.vue"

</script>

<template>
  <div class="wrapper border">
    <div class="menu">
      <div class="chat-history border">
        <HistoryComponent> </HistoryComponent>
      </div>
    </div>

    <div class="border chat">
      <OpenedChatComponent> </OpenedChatComponent>
    </div>

  </div>
</template>


<style scoped>
.wrapper {
  display: flex;
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
}

.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
