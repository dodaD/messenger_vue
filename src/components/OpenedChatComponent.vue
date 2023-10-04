<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();

import { useCurrentReceiverStore } from "../stores/CurrentReceiver";
const receiverStore = useCurrentReceiverStore();

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import MessageComponent from "../components/MessageComponent.vue";
import SendMessageComponent from "../components/SendMessageComponent.vue";
import ReceiverInfoComponent from "../components/ReceiverInfoComponent.vue";

setInterval(async () => {
  if (messagesStore.openedChatId === 0) {
    return;
  };
  const response = await fetch(receiverStore.link, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      receiver_id: receiverStore.receiverId,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  const OldMessages = messagesStore.allMessages[messagesStore.openedChatId];
  if (OldMessages.length === 0) {
    return;
  }
  const newMessages = responseJSON.data;
  if (OldMessages[newMessages.length - 1].id === newMessages[newMessages.length - 1].id) {
    return;
  }

  for (let i = 0; i < 20; i++) {
    if (OldMessages[i].id === newMessages[i].id) {
      continue;
    }
    messagesStore.allMessages[messagesStore.openedChatId].unshift(newMessages[i]);
  }

  const historyChatWithReceiverId = messagesStore.history.findIndex(obj => {
    return obj.interlocutorId === receiverStore.receiverId && obj.receiver_type == newMessages[0].receiver_type;
  });
  messagesStore.history[historyChatWithReceiverId].message = newMessages[newMessages.length - 1].message;
}, 5000);

let scrollFinished = true;

async function getMoreMessages(event) {
  const scrollHeight = (event.target.scrollHeight - event.target.clientHeight) * 0.95;
  if (-1 * event.target.scrollTop > scrollHeight && scrollFinished) {
    scrollFinished = false;
    receiverStore.page++;
    const response = await fetch('http://localhost/api/message/chat-beetween-users?page=' + receiverStore.page, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
      body: JSON.stringify({
        receiver_id: receiverStore.receiverId,
      })
    });
    const responseJSON = await response.json();
    if (!response.ok) {
      console.log(responseJSON);
      return;
    }

    if (responseJSON.data[0] === undefined) {
      receiverStore.page--;
      return;
    }
    for (let i = 0; i < responseJSON.data.length - 1; i++) {
      messagesStore.allMessages[messagesStore.openedChatId].push(responseJSON.data[i]);
    }
    scrollFinished = true;
  }
}
</script>

<template>
  <div class="wrapper">
    <ReceiverInfoComponent> </ReceiverInfoComponent>
    <div class="opened-chat" id="opened-chat" @scroll="getMoreMessages">
      <p v-if="messagesStore.openedChatId === 0"> TODO: text from file using library, that in future I could translate
        easily
      </p>
      <div v-for="message in messagesStore.allMessages[messagesStore.openedChatId]  " :key="message.id"
        :class="message.user_id === loggedInUser.userId ? 'sent-message' : 'received-message'"
        @click="console.log(loggedInUser.userId)">
        <MessageComponent :message="message"> </MessageComponent>
      </div>
    </div>
    <SendMessageComponent> </SendMessageComponent>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.opened-chat {
  display: flex;
  overflow-y: scroll;
  flex-direction: column-reverse;
  flex: 1 1 auto;
}

.sent-message {
  margin-left: auto;
}

.received-message {
  margin-right: auto;
}
</style>
