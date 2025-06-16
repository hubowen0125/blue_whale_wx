<script lang="ts" setup></script>


<template>
    <view class="deliver_goods_info flex_column">
        <view>送货信息</view>
        <view class="flex_align deliver_goods_info_item">
            <view>配送站信息</view>
            <view class="flex_1">
                <view class="deliver_goods_title">新村路打包站</view>
                <view class="deliver_goods_address">上海市甘泉路809号</view>
                <view class="deliver_goods_tel">13601805978</view>
            </view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.deliver_goods_info {
    padding: 36rpx 28rpx;
    font-weight: bold;
    font-size: 32rpx;
    color: #202020;
    gap: 24rpx;
    background: #FFFFFF;
    border-radius: 24rpx;

    .deliver_goods_info_item {
        background: #F2F6FF;
        padding: 34rpx 28rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #202020;
        border-radius: 24rpx;
        text-align: right;

        .deliver_goods_address {
            font-weight: 400;
            color: #7C8191;
            margin: 12rpx 0;
        }

        .deliver_goods_tel {
            color: #0C62FF;
        }
    }
}
</style>