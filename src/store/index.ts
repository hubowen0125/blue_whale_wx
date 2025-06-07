import {createPinia} from "pinia";
import {createPersistedState} from "pinia-plugin-persistedstate";

const pinia = createPinia()
/**
 * 创建一个符合 pinia-plugin-persistedstate 插件要求的 storage 对象
 */
const storage = {
    getItem: (key: any) => uni.getStorageSync(key),
    setItem: (key: any, value: any) => uni.setStorageSync(key, value),
    removeItem: (key: any) => uni.removeStorageSync(key),
}
/**
 * 设置pinia持久性保存在本地缓存中
 */
pinia.use(createPersistedState({
    storage: storage,
    key: id => `__persisted__${id}`,
}))
export default pinia