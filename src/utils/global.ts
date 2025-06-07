/**
 * 全局提示文案
 * @param toastParams 
 */
export const toastFu = (toastParams: {
    title?: string,  // 提示的内容
    icon?: 'none' | 'success' | 'loading', // 图标
    image?: string, // 自定义图标的本地路径
    mask?: boolean,  // 是否显示透明蒙层
    duration?: number, // 提示的延迟时间
    successCB?: () => void,  // 成功的回调函数
    failCB?: () => void,  // 失败的回调函数
    completeCB?: () => void,   // 回调函数（调用成功、失败都会执行）
} = {}) => {
    const {
        title = '接口错误，请稍后...',
        icon = 'none',
        image = '',
        mask = true,
        duration = 2000,
        successCB = () => { },
        failCB = () => { },
        completeCB = () => { }
    } = toastParams;

    uni.showToast({
        title,
        icon,
        image,
        mask,
        duration,
        success: successCB,
        fail: failCB,
        complete: completeCB,
    });
};



/**
 * 全局加载中
 */
export const loadingFu = (toastParams: {
    title?: string,  // 提示的内容
    mask?: boolean,  // 是否显示透明蒙层
    successCB?: () => void,  // 成功的回调函数
    failCB?: () => void,  // 失败的回调函数
    completeCB?: () => void,   // 回调函数（调用成功、失败都会执行）
} = {}) => {
    const {
        title = '加载中...',
        mask = true,
        successCB = () => { },
        failCB = () => { },
        completeCB = () => { }
    } = toastParams;
    uni.showLoading({
        title,
        mask,
        success: successCB,
        fail: failCB,
        complete: completeCB,
    });
}
