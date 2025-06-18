<script lang="ts" setup>
import no_data_icon from "@/static/images/no_data_icon.png"

// 声明 props
const props = defineProps({
    noDataText: {
        type: String,
        default: ''
    }
})

</script>

<template>
    <view class="no_data">
        <image class="no_data_icon" :src="no_data_icon"></image>
        <view class="no_data_text">--{{ noDataText }}--</view>
    </view>
</template>

<style lang="scss" scoped>
.no_data {
    width: 164rpx;
    height: 108rpx;
    padding-top: 140rpx;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .no_data_icon {
        width: 164rpx;
        height: 108rpx;
        position: absolute;
        top: 0;
        left: 0;
    }

    .no_data_text {
        position: relative;
        font-weight: 400;
        font-size: 24rpx;
        color: #BFC3CA;
        line-height: 24rpx;
        text-align: center;
    }
}
</style>