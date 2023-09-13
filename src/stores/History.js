import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('historyStore', () => {
  const history = ref([]);

 function $reset() {
    history.value = [];
  };

  return { history };
})
