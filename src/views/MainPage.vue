<script setup>
import OpenedChatComponent from "../components/OpenedChatComponent.vue"
import HistoryComponent from "../components/HistoryComponent.vue"

</script>

<template>
  <HistoryComponent> </HistoryComponent>
  <OpenedChatComponent> </OpenedChatComponent>
</template>


<style scoped>
div {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
  background-color: #ffe;
}

input,
textarea {
  background: none;
  border: 0;
}

.messageName {
  margin: 0;
  padding: 0;
}

.message {
  margin-left: 10px;
}

.sent-message {
  margin-left: auto;
  width: fit-content;
}

.received-message {
  margin-right: auto;
  width: fit-content;
}

.userPicture {
  border: 1px solid black;
  border-radius: 100px;
  width: 50px;
  height: 50px;
  margin: 10px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.activeUser {
  margin: 0;
  height: 70px;
  width: 70px;
  margin-top: auto;
  margin-bottom: auto;
}

.historyMessage {
  border: 0;
  margin: 0;
  padding: 0;
}

.messageWrapper,
.userWrapper {
  display: flex;
}

.userInfo {
  margin: 0;
  border: 0;
  padding-right: 0;
}

.userInfo div {
  margin: 0;
  margin-bottom: 3px;
  padding-left: 15px;
  margin-right: 5px;
  width: fit-content;
}

.userInfo h4 {
  margin: 0;
}

.userInfo div:last-of-type {
  padding-right: 20px;
  margin-left: 20px;
}

.userInfo div:first-of-type {
  position: relative;
  border-left: 0;
  margin-left: 3px;
}

.userInfo div:first-of-type::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-image: linear-gradient(to right, transparent, black);
  z-index: -1;
}

.theWrapper {
  display: flex;
  height: 96vh;
  margin-bottom: 0;
}

.wrapperChat {
  width: 65%;
  display: flex;
  flex-direction: column;
}

.menu {
  display: flex;
  flex-direction: column;
  width: 30%;
}

.chatHistory {
  flex-grow: 1;
  overflow-y: scroll;
}

.chat {
  flex-grow: 1;
  overflow-y: scroll;
}

.search {
  margin: 10px;
  padding: 10px;
  border-bottom: 1px solid black;
}

.header {
  height: 10%;
}

.header h4 {
  margin: 0;
}

.messageInput {
  margin: 10px;
  padding: 10px;
  flex-grow: 0;
  height: 75px;
  border: 1px solid black;
}
</style>
