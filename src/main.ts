import { ComponentOptions, createSSRApp } from "vue";
import App from "./App.vue";
import pinia from "./store";
import { toastFu, loadingFu } from "./utils/utils";
import { useUserStore } from "@/store/modules/user";
import share from "@/static/share.jpg"


// 重置默认css
import "@/style/reset.css"

/**
 * 设置白名单列表不需要校验token
 */
const whiteList = [
    "/pages/tabbar/index",
    "/pages/login/index",
    "/pages/dealer/index"
]

/**
 * 设置跳转校验方法
 * @param url 
 * @returns 
 */
const hasPermission = (url: string) => {
    const useUser = useUserStore()
    const splitUrl = url.split('?')[0]
    if (splitUrl === '/pages/webView/index') {
        console.log(url, 'splitUrlsplitUrlsplitUrlsplitUrl');
        const key = url.split("?")[1]
        if (key.includes('key')) {
            return true
        }
        if (useUser.token) {
            return true
        }
        return false
    }
    if (whiteList.indexOf(splitUrl) !== -1 || useUser.token) {
        return true
    }
    return true
}

/**
 * 添加拦截器
 */
uni.addInterceptor('navigateTo', {
    invoke(args) {
        if (!hasPermission(args.url)) {
            uni.navigateTo({
                url: '/pages/login/index'
            })
            return false
        }
    },
})



// 定义一个简单的 mixin
const shareMixin: ComponentOptions<any> = {
    onShareAppMessage() {
        const useUser = useUserStore()
        console.log(useUser.shareParam, 'useUser.shareParamuseParams.shareParam');
        if (useUser.shareParam.title) {
            const obj = { ...useUser.shareParam }
            useUser.setShareParamFu({})
            return obj; // 如果页面已有定义，跳过全局 mixin
        }
        return {
            title: '蓝鲸',
            path: '/pages/loading/index',
            imageUrl: share
        };
    },
};

export function createApp() {
    const app = createSSRApp(App);
    app.config.globalProperties.$Toast = toastFu;
    app.config.globalProperties.$Loading = loadingFu
    app.config.globalProperties.$CloseLoading = uni.hideLoading
    app.config.globalProperties.$successCode = 200

    app.use(pinia)
    app.mixin(shareMixin)
    return {
        app,
    };
}
