<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
// import configDefault from "@/common/js/config.default"

onLaunch(() => {
    console.log("App Launch");
    // loadFontFace()
});
onShow(() => {
    console.log("App Show");
});
onHide(() => {
    console.log("App Hide");
});

// const loadFontFace = () => {
//     uni.loadFontFace({
//         global: true,
//         family: "FZZYJW",
//         source: `url(${configDefault.dev.ossApi}/tv-bucket/tv/public/file/FZZYJW.ttf)`, //文鼎书林宋体
//         success(res) {
//             console.log(res);
//         },
//         fail(fail) {
//             console.log("fail: ", fail);
//         },
//     });
// }

</script>

<style lang="scss">
@import '@/wxcomponents/vant-weapp/common/index.wxss';
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import "../src/style//index.scss"
</style>