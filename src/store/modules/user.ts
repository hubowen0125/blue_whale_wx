import { defineStore } from "pinia";

export const useUserStore = defineStore('use', () => {

    const token = ref('')

    const setTokenFu = (data: string) => {
        token.value = data
    }

    return {
        token,
        setTokenFu
    }

}, { persist: true, })