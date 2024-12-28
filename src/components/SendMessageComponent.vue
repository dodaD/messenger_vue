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
</script>

<template>
  <div>
    <div v-if="isEditing" class="original-editing-message">
      {{ props.originalMessage }}
    </div>

    <div class="input-wrapper">
      <textarea v-model="newMessage" id="wrapper-1" class="send-message" @keyup.enter.exact="sendMessage"
        oninput='this.style.height = "";this.style.height = this.scrollHeight + "px"' />
      <button @click="sendMessage" class="send-button"> Send </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/styles/colours.scss";

.input-wrapper {
  margin-top: 5px;
  height: fit-content;
  display: flex;
  width: 100%;
}

.original-editing-message {
  width: 100%;
  height: 30px;
  background-color: var(--accent-colour);
  white-space: pre-wrap;
  overflow: hidden;
}

.send-message {
  max-height: 130px;
  min-height: 75px;
  height: 100%;
  resize: none;
  width: 85%;
}

.send-button {
  width: 10%;
  height: fit-content;
  margin: auto;
}
</style>
