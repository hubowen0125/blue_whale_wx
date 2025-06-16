<script lang="ts" setup>
import search_icon from "@/static/images/search_icon.png"

const props = defineProps({
    placeholder: {
        type: String,
        default: ''
    }
})

</script>

<template>
    <view class="search_con flex_align">
        <image class="search_icon" :src="search_icon"></image>
        <input class="flex_1" type="text" :placeholder="props.placeholder">
    </view>
</template>


<style lang="scss" scoped>
.search_con {
    height: 88rpx;
    background: #FFFFFF;
    border-radius: 12rpx;
    padding: 0 32rpx;
    gap: 20rpx;
    position: relative;

    .search_icon {
        width: 28rpx;
        height: 28rpx;
    }
}
</style>
