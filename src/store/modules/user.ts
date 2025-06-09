import { defineStore } from "pinia";
import { getWxNav } from "@/utils/com";

export const useUserStore = defineStore('use', () => {

    const wxNavObj = getWxNav()

    const token = ref('')
    const navHeight = ref(0)  // 导航栏高度
    const statusBarHeight = ref(0)  // 状态栏高度
    const statusBarWidth = ref(0)  // 状态栏宽度
    const statusBarLeft = ref(0)  // 状态栏左侧距离

    const setTokenFu = (data: string) => {
        token.value = data
    }


    const setNavHeagihtFu = () => {
        navHeight.value = wxNavObj.navHeight
        statusBarHeight.value = wxNavObj.statusBarHeight
        statusBarWidth.value = wxNavObj.statusBarWidth
        statusBarLeft.value = wxNavObj.statusBarLeft
    }

    return {
        token,
        navHeight,
        statusBarHeight,
        statusBarWidth,
        statusBarLeft,
        setTokenFu,
        setNavHeagihtFu
    }

}, { persist: true, })