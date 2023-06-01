<template> 
<div class="theWrapper">
    <div class="menu">
        <input class="search" placeholder="Search bar">
        <div class="chatHistory">Chat list will be here</div>
    </div>    
    <div class="wrapperChat"> 
        <div class="header">Other User info will be here</div>
        <div class="chat">
            <div v-for="message in gotMessages.slice().reverse()" :key="message.id" class="message"> 
                <MessageComponent :message="message" />
            </div>
        </div>
        <textarea class="messageInput" 
            placeholder="Message input will be here"  
            v-model="newMessage"
            @blur="store"
            autofocus
        ></textarea>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { useCookies } from "vue3-cookies";
// import MessageComponent from "src/components/MessageComponent.vue";
import MessageComponent from "@/components/MessageComponent.vue";

const gotMessages = ref([]);
const { cookies } = useCookies();
onBeforeMount(async()  => {
    const response = await fetch('http://localhost/api/message/1/2');
    const responseJSON = await response.json();
    if (!response.ok) {
        console.log(responseJSON);
        return
    }
    gotMessages.value = responseJSON;
    cookies.set("userId",2);
});

const newMessage = ref('');
async function store () {
    const response = await fetch('http://localhost/api/message', {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            message: newMessage.value,
            user_id: 1,
            receiver_id: 2,
        })
    });
    const responseJSON = await response.json();
    if (!response.ok) {
        console.log(responseJSON);
        return
    }
    newMessage.value = '';
    gotMessages.value.push(responseJSON);
}
</script>

<style scoped > 
div {
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
    background-color: #ffe;
}
input, textarea {
    background: none;
    border: 0;
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
.menu  {
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
.message {
    width: 45%;
    display: flex;
}
.message:has(div.messageToRight), .message:has(input.messageToRight) {
    justify-content: flex-end;
    margin-left: auto;
    background-color: aquamarine;
}

.search {
    margin: 10px;
    padding: 10px;
    border-bottom: 1px solid black;
}
.header {
    height: 10%;
}
.messageInput {
    margin: 10px;
    padding: 10px;
    flex-grow: 0;
    height: 75px;
    border: 1px solid black;
}
</style>
