import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errorStore', () => {
  const errorMessages = ref([]);

  function storeErrors(errors) {
    if (typeof errors === "string") {
      errorMessages.value.push(errors);

      setTimeout(() => {
        errorMessages.value = errorMessages.value.filter((item) => {
          return item != errors;
        });
      }, 5000);

      return;
    }

    if (typeof errors === "object") {
      Object.values(errors).forEach((error) => {
        return storeErrors(error);
      }); 
    }
  }

  return { errorMessages, storeErrors };
})
