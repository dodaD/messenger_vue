<script setup>
import { useMessagesStore } from "../stores/Messages.js";
const messagesStore = useMessagesStore();

import { useUserStore } from "../stores/User.js";
const loggedInUser = useUserStore();
import { useErrorStore } from '../stores/Error.js';

const errorStore = useErrorStore();
import { ref } from 'vue';

import { defineProps } from 'vue';
const props = defineProps({
  message: Object,
  chatId: String,
});

const updatedAt = ref('');
const date = ref(new Date(props.message.updated_at));
const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
updatedAt.value = date.value.toLocaleString('en-US', options);

const show = ref(true);
const allowedToClick = props.message.user_id === loggedInUser.userId;

const showMenu = ref(false);
const actionClicked = ref(false);
const showPropToDelete = ref(false);

async function deleteMessage() {
  showPropToDelete.value = false;
  if (allowedToClick === false) {
    errorStore.storeErrors('You are not allowed to delete this message');
    return;
  }
  messagesStore.deleteMessage(props.message.id);
}
</script>

<template>
  <div v-if="show" class="border message" @mouseover="showMenu = true" @mouseleave="showMenu = false">
    <div> {{ props.message.reference_message }} </div>
    {{ props.message.message }}
    <div v-if="props.message.updated_at !== props.message.created_at">Updated: {{ updatedAt }}</div>

    <div class="hidden-menu" @click="actionClicked = true" v-if="showMenu && !actionClicked">
      <div @click=" $emit('editing', props.message.id, allowedToClick)"> Edit </div>
      <div @click="showPropToDelete = true"> Delete </div>
    </div>
  </div>
  <div v-if="showPropToDelete" class="propmpt-wrapper border">
    <div>Are you sure you want to delete message? </div>
    <button @click="deleteMessage"> Yes! </button>
    <button @click="showPropToDelete = false"> No, not really </button>
  </div>
</template>

<style scoped>
button {
  height: 20px;
  min-width: 20px;
  width: fit-content;
}

.border {
  border: 1px solid black;
  margin: 10px;
  padding: 10px;
}

.changing {
  border: none;
  background-color: transparent;
  border-bottom: 1px solid purple;
  margin: 0;
  width: fit-content;
  height: 20px;
  resize: none;
}

.save-changes-button {
  width: fit-content;
  margin: 0 5px;
}

.message {
  width: fit-content;
  white-space: pre-wrap;
  position: relative;
}

.propmpt-wrapper {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
}

.propmpt-wrapper button {
  margin: 5px 10px;
}
</style>
