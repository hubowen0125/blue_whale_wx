import { defineStore } from "pinia";

export const useManufacturerStore = defineStore('manufacturer', () => {

    const shoppingCart = ref<Array<any>>([])
    // 订货卡信息
    const orderCard = ref<any>([])


    const setShoppingCartFu = (data: any) => {
        shoppingCart.value = data
    }

    const setOrderCardFu = (data: any) => {
        orderCard.value = data
    }

    const resetState = () => {
        shoppingCart.value = []
        orderCard.value = []
    }
    return {
        orderCard,
        setOrderCardFu,
        shoppingCart,
        setShoppingCartFu,
        resetState
    }

}, { persist: true, })