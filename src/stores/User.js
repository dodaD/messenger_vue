import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useErrorStore } from '../stores/Error.js';
import { useRouter } from 'vue-router'
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export const useUserStore = defineStore('userStore', () => {
  const router = useRouter();
  const errorStore = useErrorStore();
  const userId = ref(0);
  const userName = ref('');
  const userNickname = ref('');
  const userEmail = ref('');

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
      clearInterval(messagesStore.intervalId);
      clearInterval(messagesStore.elementIntervalId);
      cookies.remove("authToken");
      messagesStore.intervalId = 0;
      router.push('/login');
    }
    userId.value = responseJSON.id;
    userName.value = responseJSON.name;
    userNickname.value = responseJSON.nickname;
    userEmail.value = responseJSON.email;
  };

  return { userId, userName, userNickname, userEmail, getUserInfo };
})
