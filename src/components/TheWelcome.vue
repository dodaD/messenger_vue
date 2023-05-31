<template>
    <div :if="!show"> {{ props.message }}</div>
    <button @click="changeMessage">Change</button>
    <input type="text" v-model="updateMessage" :if="show">
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue';

const props = defineProps({
  message: String,
  id: Number
})

const updateMessage = ref('');
const show = ref(false);
function changeMessage () {
    fetch('http://localhost/api/messages/'+ props.id, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            message: updateMessage.value,
        })
    })
    show.value = true;
}
</script>