<script lang="ts" setup>
import no_data_icon from "@/static/images/no_data_icon.png"

// 声明 props
const props = defineProps({
    noDataText: {
        type: String,
        default: ''
    },
    noDataDescText: {
        type: String,
        default: ''
    }
})

</script>

<template>
    <view class="no_data flex_column flex_align">
        <image class="no_data_icon" :src="no_data_icon"></image>
        <view class="no_data_text">{{ noDataText }}</view>
        <view class="no_data_desc_text">{{ noDataDescText }}</view>
    </view>
</template>

<style lang="scss" scoped>
.no_data {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;

    .no_data_icon {
        width: 164rpx;
        height: 108rpx;
        margin: auto;
    }

    .no_data_text {
        font-weight: 500;
        font-size: 26rpx;
        color: #202020;
        margin: 48rpx 0 12rpx;
    }

    .no_data_desc_text {
        font-weight: 400;
        font-size: 24rpx;
        color: #AEB0BC;
    }
}
</style>