import { ref } from "vue";
import { defineStore } from "pinia";
import { useErrorStore } from "@/stores/Error.js";
import { useCookies } from "vue3-cookies";
import { useUserStore } from "@/stores/User.js";

export const useSearchStore = defineStore('searchStore', () => {
  const errorStore = useErrorStore();
  const { cookies } = useCookies();
  const userStore = useUserStore();
  const searchResults = ref([]);

  async function search(nicknameToSearch) {
    if (nicknameToSearch.length <= 2) {
      searchResults.value = [];
      return;
    }

    const response = await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/search', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
      body: JSON.stringify({
        nickname: '@' + nicknameToSearch,
      })
    });
    const responseJSON = await response.json();
    if (response.status === 401) {
      userStore.logOut();
    }
    if (!response.ok) {
      errorStore.storeErrors(responseJSON.error);
      return;
    }
    searchResults.value = responseJSON;
  }

  return { searchResults, search };
})
