<script lang="ts" setup></script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡信息" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_column flex_1">
            
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 304rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }
}
</style>