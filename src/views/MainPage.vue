<script setup>
import { computed, ref } from "vue";
import OpenedChatComponent from "@/components/pageComponents/OpenedChatComponent.vue";
import HistoryComponent from "@/components/pageComponents/HistoryComponent.vue";
import SearchComponent from "@/components/pageComponents/SearchComponent.vue";
import ProfileComponent from "@/components/ProfileComponent.vue";
import { useUserStore } from "@/stores/User.js";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();
const userStore = useUserStore();

window.addEventListener("resize", () => { isItMobile.value = checkIfItsMobile() });
const userHasLoggedIn = computed(() => {
  return cookies.get('authToken') !== null;
});
const isItMobile = ref(checkIfItsMobile());

function checkIfItsMobile() {
  return window.screen.width <= 600;
};

const isChatOpenedOnMobile = ref(true);
function openHistorOnMobile() {
  isChatOpenedOnMobile.value = false;
}
</script>

<template>
  <button v-if="userHasLoggedIn" class="logout-button button" @click="userStore.logOut">Log Out </button>
  <div class="the-wrapper border">
    <div class="menu" v-if="!isChatOpenedOnMobile || !isItMobile">
      <SearchComponent />
      <div class="chat-history border">
        <HistoryComponent />
      </div>
      <ProfileComponent />
    </div>

    <div class="border chat" v-if="isChatOpenedOnMobile || !isItMobile">
      <OpenedChatComponent @openHistorOnMobile="openHistorOnMobile" />
    </div>
  </div>
</template>


<style scoped lang="scss">
@import '../styles/colours.scss';
@import '../styles/MobileVersion.scss';

@media (min-width:600px) {
  .the-wrapper {
    display: flex;
    height: 95vh;
    max-width: 80%;
    margin-right: auto !important;
    margin-left: auto !important;
  }

  .menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    /*TODO decide whether I want fixated width for menu or for chat*/
    width: 30%;
  }

  .chat-history {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-x: hidden;
  }

  .chat-history::-webkit-scrollbar {
    width: 1px;
    background-color: rgba(10, 10, 10, 0.05);
  }

  .chat-history::-webkit-scrollbar-track {
    width: 1px;
    background-color: rgba(10, 10, 10, 0.1);
  }

  .chat-history::-webkit-scrollbar-thumb {
    width: 1px;
    background-color: rgba(10, 10, 10, 0.5);
  }


  .chat {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .logout-button {
    right: 10px;
    position: absolute;
    width: 70px;
  }
}

@media (max-width:600px) {
  .menu {
    width: 100%;
  }

  .logout-button {
    right: 10px;
    position: absolute;
    width: 70px;
  }

  .chat {
    height: calc(100% - 21px);
    border: 5px solid var(--border-colour);
  }

  .logout-button {
    display: none;
  }
}
</style>
