import { defineStore } from "pinia";

export const useWholesalerStore = defineStore('wholesaler', () => {

    const shoppingCart = ref<Array<any>>([])
    const shoppingManufacturer = ref<any>({})

    const setShoppingCartFu = (data: any) => {
        shoppingCart.value = data
    }

    const setShoppingManufacturerFu = (data: any) => {
        shoppingManufacturer.value = data
    }
    return {
        setShoppingCartFu,
        shoppingManufacturer,
        setShoppingManufacturerFu,
        shoppingCart,
    }

}, { persist: true, })