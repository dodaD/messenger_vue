import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', () => {
  const userId = ref(0);
  const userName = ref('');
  const userNickname = ref('');

 function $reset() {
    userId.value = 0;
    userName.value = '';
    userNickname.value = '';
  };

  return { userId, userName, userNickname };
})
