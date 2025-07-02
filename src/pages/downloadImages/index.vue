<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import { useUserStore } from "@/store/modules/user";
import { deepCopy } from "@/utils/utils";
import { saveFileFu } from "@/utils/publicRequest";

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const productId = ref('')
const productDetail = ref<any>({})

onLoad(() => {
    productDetail.value = deepCopy(useUser.productDetail)
    console.log(useUser.productDetail, 'useUser.productDetailuseUser.productDetailuseUser.productDetail');
})

const downloadImages = async () => {
    console.log(productDetail.value, 'productDetail.valueproductDetail.valueproductDetail.value');
    const imgList = productDetail.value.productImagesList.filter((item: { active: any; }) => item.active)
    console.log(imgList, 'imgListimgListimgList');
    saveFileFu({
        suffix: '',
        name: '',
        url: imgList[0].imageUrlFull,
        type: 'img'
    })
    // const results = await batchDownloadAndSaveImages(imgList.map((item: { imageUrlFull: any; }) => item.imageUrlFull))

}

</script>


<template>
    <view class="container flex_column">
        <com-header headerTitle="下载图片"></com-header>
        <view class="main_con flex_1">
            <view class="image_detail flex_column">
                <view>{{ productDetail.productName }}</view>
                <view class="image_info">款号: {{ productDetail.styleNumber }}</view>
                <view class="image_list">
                    <view class="image_item" v-for="item in productDetail.productImagesList" :key="item.id">
                        <image class="image_item_img" :src="item.imageUrlFull"></image>
                        <image class="image_item_checkbox" :src="item.active ? checkbox_active : checkbox"
                            @click="item.active = !item.active"></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con">
            <button class="button_defalut" @click="downloadImages">立即下载</button>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.main_con {
    margin-top: 24rpx;
    padding: 24rpx;
    overflow-x: hidden;
    overflow-y: auto;

    .image_detail {
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 36rpx 28rpx;
        font-weight: bold;
        font-size: 32rpx;
        color: #202020;
        gap: 16rpx;

        .image_info {
            font-weight: 400;
            font-size: 24rpx;
            color: #7C8191;
        }

        .image_list {
            display: grid;
            grid-template-columns: repeat(2, 312rpx);
            gap: 22rpx;

            .image_item {
                height: 312rpx;
                background: #D8D8D8;
                border-radius: 16rpx;
                position: relative;
                overflow: hidden;

                .image_item_img {
                    width: 100%;
                    height: 100%;
                }

                .image_item_checkbox {
                    position: absolute;
                    width: 36rpx;
                    height: 36rpx;
                    top: 20rpx;
                    right: 20rpx;
                }
            }
        }
    }
}
</style>