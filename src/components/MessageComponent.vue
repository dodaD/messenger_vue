<template>
  <div v-if="show"> {{ messageToShow }}</div>
  <button v-if="show" @click="show = !show; updatedMessage = messageToShow">C</button>
  <button v-if="show" @click=deleteMessage>D</button>
  <button v-if="!show" @click=editMessage>Save changes</button>
  <input v-if="!show" v-model="updatedMessage" />
</template> 

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const props = defineProps({
  message: Object,
});
const messageToShow = ref(props.message.message);

const updatedMessage = ref('');
const show = ref(true);

async function editMessage() {
  const response = await fetch('http://localhost/api/message/edit/' + props.message.id, {
    method: "PATCH",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      message: updatedMessage.value,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  messageToShow.value = responseJSON.message;
  show.value = true;
}

const emit = defineEmits(['deletedMessage']);

async function deleteMessage() {
  const response = await fetch('http://localhost/api/message/' + props.message.id, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  emit('deletedMessage', props.message.id);
}
</script>

<style scoped>
button {
  height: 20px;
  width: 20px;
}
</style>
