import { defineStore } from "pinia";

export const useWholesalerStore = defineStore('wholesaler', () => {

    const shoppingCart = ref<Array<any>>([])
    const manufacturerId = ref('')

    const setShoppingCartFu = (data: any) => {
        shoppingCart.value = data
    }

    const setManufacturerIdFu = (id: string) => {
        manufacturerId.value = id
    }
    return {
        shoppingCart,
        manufacturerId,
        setShoppingCartFu,
        setManufacturerIdFu
    }

}, { persist: true, })