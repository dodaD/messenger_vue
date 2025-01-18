<script setup>
import { computed, ref, watch } from 'vue';
import { useMessagesStore } from '@/stores/Messages';
import { useCurrentReceiverStore } from '@/stores/CurrentReceiver';
import { useErrorStore } from '../stores/Error.js';
import { defineProps } from 'vue';

const messagesStore = useMessagesStore();
const receiverStore = useCurrentReceiverStore();
const errorStore = useErrorStore();
const newMessage = ref('');
const previousMessageSent = ref(true);
const props = defineProps({
  editingMessageId: Number,
  isAllowedToEdit: Boolean,
  originalMessage: String,
});
const emit = defineEmits(['finishedEditing']);

const isEditing = computed(() => { return props.editingMessageId !== null && props.isAllowedToEdit });
watch(props, () => {
  if (isEditing.value) {
    newMessage.value = props.originalMessage;
  }
});

async function sendMessage() {
  if (isEditing.value) {
    editMessage();
    return;
  }
  if (previousMessageSent.value) {
    previousMessageSent.value = false;
    await messagesStore.sendMessage(newMessage.value);
  }
  newMessage.value = "";
  previousMessageSent.value = true;

  const historyChatId = messagesStore.history.findIndex(obj => {
    return obj.interlocutorId === receiverStore.receiverId;
    //  TODO: when different entities also check for them too
    //  Ex: ... && obj.receiver_type == receiverStore.entity
  });
  if (historyChatId !== 0) {
    const currentChat = messagesStore.history.splice(historyChatId, 1);
    messagesStore.history.unshift(currentChat[0]);
  }
  document.querySelector('.opened-chat').scrollBy(0, document.querySelector('.opened-chat').scrollHeight + 20);
}

function editMessage() {
  if (props.isAllowedToEdit === false) {
    errorStore.storeErrors('You are not allowed to edit this message');
    return;
  }
  messagesStore.updateMessage(props.editingMessageId, newMessage.value);
  newMessage.value = "";
  emit('finishedEditing');
}

function closeEditing() {
  newMessage.value = "";
  emit('finishedEditing');
}
</script>

<template>
  <div class="sending-message-component-wrapper">
    <div class="original-editing-message" v-if="isEditing">
      {{ props.originalMessage }}
      <font-awesome-icon :icon="['fas', 'xmark']" @click="closeEditing" class="close-editing-button" />
    </div>

    <div class="input-wrapper">
      <textarea v-model="newMessage" id="wrapper-1" class="send-message" @keyup.enter.exact="sendMessage" />
      <button @click="sendMessage" class="send-button button"> Send </button>

      <button @click="sendMessage" class="mobile-send-button button">
        <font-awesome-icon :icon="['fas', 'paper-plane']" class="paper-plane" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

.hide-original-message-line {
  display: none !important;
}

.sending-message-component-wrapper {
  margin: 0 10px;
}

.input-wrapper {
  height: fit-content;
  display: flex;
  width: 100%;
}

.original-editing-message {
  display: flex;
  width: 85%;
  height: 30px;
  background-color: var(--semi-accent-colour);
  white-space: pre-wrap;
  overflow: hidden;
  position: relative;
  border: 3px solid var(--accent-colour);
  border-image-slice: 1;
  border-image-source: linear-gradient(to left, var(--border-colour), var(--accent-colour));
  align-items: center;
  padding-left: 5px;
  border-bottom: 0;
}

.send-message {
  max-height: 130px;
  min-height: 75px;
  height: 100%;
  resize: none;
  width: 85%;
  padding: 0;
  border: 3px solid var(--accent-colour);
  padding-left: 5px;
  background: var(--background-colour);
  border-image-slice: 1;
  border-image-source: linear-gradient(to left, var(--border-colour), var(--accent-colour));
  color: var(--font-colour);
}

.send-button {
  width: 67px;
  margin: auto;
}

.close-editing-button {
  height: 16px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
}

.mobile-send-button {
  display: none;
}

@media (max-width:600px) {
  .send-message {
    width: 100%;
    box-sizing: border-box;
    margin-right: 10px;
  }

  .input-wrapper {
    align-items: center;
  }

  .top-button-line-wrapper-on-mobile {
    margin-left: auto;
    width: 50%;
    background-color: var(--semi-accent-colour);
    height: 35px;
    display: flex;
    align-items: center;
    border: 3px solid var(--accent-colour);
    border-image-slice: 1;
    border-image-source: linear-gradient(to left, var(--border-colour), var(--accent-colour));
    color: var(--font-colour);
    border-bottom: 0;
    border-left: 0;
  }

  .sending-message-component-wrapper {
    margin: 0;
  }

  .send-button {
    display: none;
  }

  .mobile-send-button {
    width: 40px;
    height: 25px;
    font-size: 16px;
    display: block;
    margin-left: auto;
  }

  .paper-plane {
    transform: translateX(-2px);
  }

  .hide-original-message-line {
    display: flex !important;
    width: 50%;
    padding: 0;
    margin-left: auto;
  }

  .original-editing-message {
    width: 100%;
    padding: 0;
    border-right: 0;
    background-image: linear-gradient(to right, var(--semi-accent-colour), var(--background-colour));
  }

  .close-editing-button {
    height: 16px;
    margin-left: auto;
    position: unset;
    transform: translateY(0);
    margin-right: 12px;
  }
}
</style>
