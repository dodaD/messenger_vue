<template>
  <textarea v-model="newMessage"> {{ newMessage }} </textarea>
  <button v-on:click="sendMessage"> Send </button>
</template> 

<script setup>
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { defineProps } from 'vue'

const { cookies } = useCookies();
const props = defineProps({
  receiverId: Number,
  receiverType: String,
});

const newMessage = ref('');
const emit = defineEmits(['addedMessage']);

async function sendMessage() {
  if (newMessage.value === '') {
    alert("You cannot send nothing :(");
    return;
  }
  const response = await fetch('http://localhost/api/message/add', {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-type": "application/json",
      "Authorization": "Bearer " + cookies.get("authToken"),
    },
    body: JSON.stringify({
      message: newMessage.value,
      receiver_id: props.receiverId,
      receiver: props.receiverType,
    })
  });
  const responseJSON = await response.json();
  if (!response.ok) {
    console.log(responseJSON);
    return;
  }
  emit('addedMessage', responseJSON);
}
</script>
