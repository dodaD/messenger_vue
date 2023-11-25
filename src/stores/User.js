import { ref } from "vue";
import { defineStore } from "pinia";
import { useErrorStore } from "@/stores/Error.js";
import { useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import { useMessagesStore } from "@/stores/Messages.js";

export const useUserStore = defineStore('userStore', () => {
  const router = useRouter();
  const errorStore = useErrorStore();
  const messagesStore = useMessagesStore();
  const { cookies } = useCookies();
  const userId = ref(0);
  const userName = ref('');
  const userNickname = ref('');
  const userEmail = ref('');

  function logOut() {
    clearInterval(messagesStore.intervalId);
    clearInterval(messagesStore.elementIntervalId);
    cookies.remove("authToken");
    messagesStore.intervalId = 0;
    router.push("/login");
  }

  async function getUserInfo() {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/user/my-user-info', {
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      }
    });
    const responseJSON = await response.json();
    if (response.status === 401) {
      logOut();
    }
    userId.value = responseJSON.id;
    userName.value = responseJSON.name;
    userNickname.value = responseJSON.nickname;
    userEmail.value = responseJSON.email;
  };

  async function login(email, password) {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/user/login', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    const responseJSON = await response.json();
    if (!response.ok) {
      errorStore.storeErrors(responseJSON);
      return;
    }
    cookies.set("authToken", responseJSON);
    router.push('/');
  }

  async function register(email, name, nickname, password, repeatPassword) {
    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/user/register', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        nickname: '@' + nickname,
        password: password,
        repeat_password: repeatPassword,
      })
    })
    const responseJSON = await response.json();
    if (!response.ok) {
      return responseJSON.error;
    }
    cookies.set("authToken", responseJSON);
    router.push('/');
  }

  return { userId, userName, userNickname, userEmail, getUserInfo, login, logOut, register };
})
