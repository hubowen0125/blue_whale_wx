import { defineStore } from "pinia";
import { getWxNav } from "@/utils/com";

export const useUserStore = defineStore('use', () => {

    const wxNavObj = getWxNav()

    const token = ref('')
    const miniRole = ref('') // 小程序角色
    const userInfo = ref<any>({})
    const navHeight = ref(0)  // 导航栏高度
    const statusBarHeight = ref(0)  // 状态栏高度
    const statusBarWidth = ref(0)  // 状态栏宽度
    const statusBarLeft = ref(0)  // 状态栏左侧距离
    const jump401 = ref(false)

    const setTokenFu = (data: string) => {
        token.value = data
    }

    const setUserInfoFu = (data: any) => {
        userInfo.value = data
    }

    const setMiniRoleFu = (data: string) => {
        miniRole.value = data
    }

    const setNavHeagihtFu = () => {
        navHeight.value = wxNavObj.navHeight
        statusBarHeight.value = wxNavObj.statusBarHeight
        statusBarWidth.value = wxNavObj.statusBarWidth
        statusBarLeft.value = wxNavObj.statusBarLeft
    }

    const setJump401Fu = (data: boolean) => {
        jump401.value = data
    }

    const resetState = () => {
        token.value = ''
        jump401.value = false
        userInfo.value = {}
    }

    return {
        token,
        userInfo,
        miniRole,
        navHeight,
        statusBarHeight,
        statusBarWidth,
        statusBarLeft,
        jump401,
        setTokenFu,
        setNavHeagihtFu,
        setUserInfoFu,
        setMiniRoleFu,
        setJump401Fu,
        resetState
    }

}, { persist: true, })