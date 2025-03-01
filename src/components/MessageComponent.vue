<script setup>
import { defineProps, ref } from 'vue';
import { useMessagesStore } from "../stores/Messages.js";
import { useUserStore } from "../stores/User.js";
import { useErrorStore } from '../stores/Error.js';

const props = defineProps({
  message: Object,
});
const emits = defineEmits(['editing']);
const errorStore = useErrorStore();
const loggedInUser = useUserStore();
const messagesStore = useMessagesStore();

const updatedAt = ref('');
const date = ref(new Date(props.message.updated_at));
const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
updatedAt.value = date.value.toLocaleString('en-US', options);

const show = ref(true);
const allowedToClick = props.message.user_id === loggedInUser.userId;

const showMenu = ref(false);
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
  <div class="mob-background-blur" v-if="showMenu" />
  <!-- For background blur for mob version when opening interaction options -->

  <div class="hover-check" @mouseleave="showMenu = false" :class="{ 'visible-selected-message': showMenu }">
    <div v-if="show" class="message" @mouseover="showMenu = allowedToClick"
      :class="allowedToClick ? 'sent-message' : 'received-message'">
      <div> {{ props.message.reference_message }} </div>
      {{ props.message.message }}
      <div v-if="props.message.updated_at !== props.message.created_at">Updated: {{ updatedAt }}</div>

      <div class="hidden-menu" @click="showMenu = false" v-if="showMenu">
        <div @click="$emit('editing', allowedToClick, props.message.id, props.message.message)"> Edit </div>
        <div @click="showPropToDelete = true"> Delete </div>
      </div>
    </div>
  </div>


  <div v-if="showPropToDelete" class="propmpt-wrapper border">
    <div class="promt-text">Are you sure you want to delete message? </div>
    <div>
      <button @click="deleteMessage" class="yes-button"> Yes! </button>
      <button @click="showPropToDelete = false"> No, not really </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

.mob-background-blur {
  display: none;
}

button {
  height: 20px;
  min-width: 20px;
  width: fit-content;
}

.hover-check {
  width: 100%;
  height: 100%;
}

.save-changes-button {
  width: fit-content;
  margin: 0 5px;
}

.message {
  width: fit-content;
  white-space: pre-line;
  position: relative;
  padding: 10px;
}

.sent-message {
  background-color: var(--accent-colour);
  margin-left: 10px;
}

.received-message {
  background-color: var(--border-colour);
}

.propmpt-wrapper {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: var(--background-colour);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.promt-text {
  margin-bottom: 10px;
}

.yes-button {
  margin-right: 10px;
}

.hidden-menu {
  position: absolute;
  height: 50px;
  background-color: var(--background-colour);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  top: 50%;
  left: 0;
  transform: translate(calc(-100% - 9px), -50%);
  width: 80px;
  padding-left: 5px;
  border: 1px solid var(--border-colour);

  div {
    border-bottom: 1px solid var(--border-colour);
  }

  div:last-of-type {
    border-bottom: none;
  }
}

@media (max-width:600px) {
  .sent-message {
    margin-left: auto;
  }

  .received-message {
    margin-right: auto;
  }

  .message {
    max-width: 90%;
    min-width: 50px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }

  .hidden-menu {
    width: 65px;
    bottom: 0;
    left: 0;
    top: unset;
    transform: translateX(-1px) translateY(calc(100% + 5px));
    border: 2px solid var(--accent-colour);

    div {
      width: 100%;
      border-bottom: 1px solid var(--accent-colour);
    }

    div:last-of-type {
      border-bottom: none;
    }
  }

  .mob-background-blur {
    display: block;
    position: fixed;
    background-color: var(--background-colour);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
    opacity: 0.7;
  }

  .visible-selected-message {
    z-index: 4;
    position: relative;
  }
}
</style>
