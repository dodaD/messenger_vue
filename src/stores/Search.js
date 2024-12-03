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
    let responseJSON = null;
    await fetch(import.meta.env.VITE_APP_API_BASE_URL + '/search', {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": "Bearer " + cookies.get("authToken"),
      },
      body: JSON.stringify({
        nickname: '@' + nicknameToSearch,
      })
    }).then(function (response) {
      if (!response.ok) {
        const responseObject = {
          [response.status]: response.statusText
        };
        errorStore.storeErrors(responseObject);
        return;
      } else if (response.status === 401) {
        userStore.logOut();
      }
      responseJSON = response.json();
    }).catch(function (error) {
      errorStore.storeErrors({ 500: "Server error - request failed. Please try reloading page" });
      return;
    });

    searchResults.value = responseJSON;
  }

  return { searchResults, search };
})
