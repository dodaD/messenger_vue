<template> 
<div class="theWrapper">
    <div class="menu">
        <input class="search" placeholder="Search bar">
        <div class="chatHistory">Chat list will be here</div>
    </div>    
    <div class="wrapperChat"> 
        <div class="header">Other User info will be here</div>
        <div class="chat">
            <div v-for="message in gotMessages" :key="message.id" class="gotMessages">You got messages:{{ message.message }}</div>
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

const newMessage = ref('');
function store () {
    fetch('http://localhost/api/messages', {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            message: newMessage.value,
            user_id: 1,
            receiver_id: 2,
        })
    })
    .then(response => response.json())
    .then(data => gotMessages.value.push(data));
    newMessage.value = '';
}

const gotMessages = ref(null);
fetch('http://localhost/api/message/1/2')
    .then(response => response.json())
    .then(data => gotMessages.value = data);

// const START_DATE = new Date('2021-09-01T00:00:00');
function filteredMessage() {
    //   return gotMessages.value
    //     .filter(s => new Date(s.created) >= START_DATE)
    //     .sort((a, b) => new Date(a.created) - new Date(b.created)
    //   );
    console.log(gotMessages.value);

}
filteredMessage();
</script>

<style scoped>  
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
.gotMessages {
    width: 45%;
    display: flex;
}
.sentMessages {
    width: 45%;
    display: flex;
    justify-content: flex-end;
    margin-left: auto;
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
