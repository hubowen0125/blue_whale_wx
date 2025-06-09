export const getWxNav = () => {
    /****************** 所有平台共有的系统信息 ********************/
    // 设备系统信息
    const menuButton = uni.getMenuButtonBoundingClientRect()
    // 状态栏高度
    let statusBarHeight = menuButton.top - 4
    const navHeight = menuButton.height + 8
    const statusBarWidth = menuButton.width
    const statusBarLeft = menuButton.left

    return {
        statusBarHeight,
        navHeight,
        statusBarWidth,
        statusBarLeft
    }
}