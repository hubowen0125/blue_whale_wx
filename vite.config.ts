import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite"


export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [
            uni(),
            AutoImport({
                imports: ["vue", "uni-app"],
                dts: true,
            })],
        // 使用 define 注入到代码中
        define: {
            "process.env": env, // 将所有环境变量注入 process.env
        }
    }
});
