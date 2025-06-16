<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"

</script>


<template>
    <view class="container flex_column">
        <com-header headerTitle="下载图片"></com-header>
        <view class="main_con flex_1">
            <view class="image_detail flex_column" >
                <view>儿童服装公主版</view>
                <view class="image_info">货号: 1872988</view>
                <view class="image_list">
                    <view class="image_item" v-for="item in 10" :key="item">
                        <image class="image_item_img"></image>
                        <image class="image_item_checkbox" :src="checkbox"></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con">
            <button class="button_defalut">立即下载</button>
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