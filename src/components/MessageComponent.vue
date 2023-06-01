<template>
    <div v-if="!show" :class="{ messageToRight: thisUser }"> {{ props.message.message }}</div>
    <button @click="changeMessage">C</button>
    <input type="text" v-model="updateMessage" v-if="show" :class="{ messageToRight: thisUser }">
    <button @click=deleteMessage>D</button>
</template>

<script setup>
import { defineProps } from 'vue'
import { ref } from 'vue';
import { useCookies } from "vue3-cookies";
import { defineEmits } from 'vue'

const { cookies } = useCookies();
const thisUser = cookies.get("userId") == props.message.user_id;

const props = defineProps({
  message: Object,
})

const updateMessage = ref('');
const show = ref(false);
function changeMessage () {
    if (show.value == false) {
        console.log(show.value);
        show.value = true;
        console.log(show.value);
        return
    }
    fetch('http://localhost/api/messages/'+ props.message.id, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            message: updateMessage.value,
        })
    })
    show.value = false;
}

const emit = defineEmits(['deleteMessage'])
function deleteMessage () {
    fetch('http://localhost/api/message/'+ props.message.id, {
        method: 'DELETE',
    })
    emit('deleteMessage', props.message.id);
}
</script>

<style scoped>
button {
    height: 20px;
    width: 20px;
}
.messageToRight {
    justify-content: flex-end;
}
</style>